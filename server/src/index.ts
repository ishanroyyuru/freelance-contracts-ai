import express, { Request, Response, NextFunction, RequestHandler } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { OpenAI } from 'openai';
import { nextTick } from 'process';
import { createRequire } from 'module';

dotenv.config();
const app = express();
const prisma = new PrismaClient();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.use(cors());
app.use(express.json());

//signup endpoint
const signupHandler: RequestHandler = async (req, res, next) => {
    console.log('🤖 signup hit!', req.body);
    try {
    const { email, password, name } = req.body;
    if (!email || !password) {
        res.status(400).json({ error: 'Email and password are required' });
        return;
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
        res.status(400).json({ error: 'Email already in use' });
        return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
        data: { email, passwordHash, name },
    });

    const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET as string,
        { expiresIn: '7d' }
    );

    res.status(201).json({ token });
    } catch (err) {
        return next(err);
    }
};
app.post('/signup', signupHandler);

//login endpoint
const loginHandler : RequestHandler = async(req, res, next) => {
    try{
        const {email, password} = req.body;

        if(!email || !password){
            res.status(400).send({ error: 'Email and password are required' });
            return;
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if(!user){
            res.status(400).send({ error: 'Invalid credentials' });
            return;
        }

        const valid = await bcrypt.compare(password, user.passwordHash);
        if(!valid){
            res.status(400).send({ error: 'Invalid credentials' });
            return;
        }

        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET as string,
            { expiresIn: '7d'}
        );

        res.status(201).json({ token });
    } catch(err){
        return next(err);
    }
}
app.post('/login', loginHandler);

//JWT-auth middleware
const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    const auth = req.headers.authorization;
    if(!auth?.startsWith('Bearer ')){
        res.status(401).json({ error: 'Missing token' });
        return;
    }

    const token = auth.slice(7);
    try{
        const payload = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
        // @ts-ignore
        req.userId = payload.userId;
        next();
    }
    catch(err){
        res.status(401).json({ error: 'Invalid token' });
    }
};

//create contract
const createContract: RequestHandler = async (req, res, next) => {
    try{
        // @ts-ignore
        const userId = req.userId;
        const { title, text, status = 'draft' } = req.body;

        const contract = await prisma.contract.create({
            data: { title, text, status, userId }
        });

        res.status(201).json(contract);
    } catch(err){
        next(err);
    }
};
app.post('/contracts', requireAuth, createContract);

//list all contrats
const listContracts: RequestHandler = async(req, res, next) => {
    try{
        // @ts-ignore
        const userId = req.userId;
        const contracts = await prisma.contract.findMany({
            where: { userId },
            orderBy: {createdAt: 'desc'}
        });

        res.status(201).json(contracts);
    } catch(err){
        next(err);
    }
};
app.get('/contracts', requireAuth, listContracts);

//get one contract by ID
const getContract: RequestHandler = async(req, res, next) => {
    try{
        // @ts-ignore
        const userId = req.userId;
        const { id } = req.params;
        const contract = await prisma.contract.findFirst({
            where: { id, userId }
        });
        if(!contract){
            res.status(404).json({ error: 'No contract found' });
            return;
        }
        res.json(contract);
    } catch(err){
        next(err);
    }
};
app.get('/contracts/:id', requireAuth, getContract);

//update contract
const updateContract: RequestHandler = async(req, res, next) => {
    try{
        // @ts-ignore
        const userId = req.userId;
        const { id } = req.params;
        const payload = req.body;
        const contracts = await prisma.contract.updateMany({
            where: { id, userId },
            data: payload
        });
        if(contracts.count === 0){
            res.status(404).json({ error: 'No contracts found or not yours' });
            return;
        }
        res.json({ message: 'Updated' });
    } catch(err){
        next(err);
    }
};
app.put('/contracts/:id', updateContract);

//delete contract
const deleteContract: RequestHandler = async(req, res, next) => {
    try{
        const { id } = req.params;
        // @ts-ignore
        const userId = req.userId;
        const contracts = await prisma.contract.deleteMany({
            where: { id, userId }
        })
        if(contracts.count === 0){
            res.status(404).json({ error: 'No contract found or not yours'});
            return;
        }
        res.json({ message: 'Deleted' });
    } catch(err){
        next(err);
    }
}
app.delete('/contracts/:id', deleteContract);

//create an annotation on a contract 
const createAnnotation: RequestHandler = async(req, res, next) => {
    try{
        // @ts-ignore
        const userId = req.userId;
        const { contractId } = req.params;
        const { startOffset, endOffset, comment } = req.body;

        const contract = await prisma.contract.findUnique({
            where: { id: contractId }
        });
        if (!contract || contract.userId !== userId) {
            res.status(404).json({ error: 'Contract not found or not yours' });
            return;
        }

        const annotation = await prisma.annotation.create({
            data: { contractId, userId, startOffset, endOffset, comment }
        });

        res.status(201).json(annotation);
    } catch(err){
        next(err);
    }
};
app.post('/contracts/:contractId/annotations', requireAuth, createAnnotation);

//list all annotations for one contract
const listAnnotations: RequestHandler = async(req, res, next) => {
    try{
        const { contractId } = req.params;
        // @ts-ignore
        const userId = req.userId;

        const annotations = await prisma.annotation.findMany({
            where: { contractId, userId },
            orderBy: { createdAt: 'asc' }
        });

        res.json({ annotations });
    } catch(err){
        next(err);
    }
};
app.get('/contracts/:contractId/annotations', requireAuth, listAnnotations);

//update one annotation
const updateAnnotation: RequestHandler = async(req, res, next) => {
    try{
        const { contractId } = req.params;
        // @ts-ignore
        const userId = req.userId;
        const { startOffset, endOffset, comment } = req.body;
        const annotations = await prisma.annotation.updateMany({
            where: { contractId, userId},
            data: { startOffset, endOffset, comment }
        })
        if(annotations.count === 0){
            res.status(404).json({ message: 'No annotations found' });
            return;
        }
        res.json({ message: 'Annotation Updated'} );
    } catch(err){
        next(err);
    }
};
app.put('/contracts/:contractId/annotations', requireAuth, updateAnnotation);

//delete one annotation
const deleteAnnotation: RequestHandler = async(req, res, next) => {
    try{
        const { contractId, id } = req.params;
        // @ts-ignore
        const userId = req.userId;
        
        const annotation = await prisma.annotation.deleteMany({
            where: { id, contractId, userId }
        })

        if(annotation.count === 0){
            res.status(404).json({ message: 'No annotation found' });
            return;
        }
        res.json({ message: 'Annotation deleted' });
    } catch(err){
        next(err);
    }
}
app.delete('/contracts/:contractId/annotations/:id', requireAuth, deleteAnnotation);

//create an AI summary
const createSummary: RequestHandler = async (req, res, next) => {
    try{
        // @ts-ignore
        const userId = req.userId;
        const { contractId } = req.params;
        const { originalText } = req.body;

        if(!originalText){
            res.status(400).json({ error: 'Original text is required' });
            return;
        }

        const contract = await prisma.contract.findUnique({
            where: { id: contractId }
        });
        if(!contract || contract.userId !== userId){
            res.status(404).json({ error: 'Contract not found or not yours'});
            return;
        }

        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: 'system', content: 'You are helpful legal assistant that summarizes legal contract clauses.' },
                { role: 'user', content: originalText }
            ]
        });
        const choice = completion.choices?.[0];
        const text = choice?.message?.content;
        if (!text) {
            res.status(502).json({ error: 'AI did not return any text' });
            return;
        }
        const summaryText = text.trim();

        const summary = await prisma.summary.create({
            data: { contractId, userId, originalText, summaryText }
        });

        res.status(201).json(summary);
    } catch(err){
        next(err);
    }
};
app.post('/contracts/:contractId/summaries', requireAuth, createSummary);

//returns your userId if you supply a valid JWT
app.get('/me', requireAuth,(req: Request, res: Response) => {
    // @ts-ignore
    res.json({ userId: req.userId });
  }
);


//test endpoints
app.get('/', (req: Request, res: Response) => {
    res.send('API is running!');
});

const PORT = parseInt(process.env.PORT ?? '5001', 10);
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));

