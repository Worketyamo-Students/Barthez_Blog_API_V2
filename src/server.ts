// src/server.ts
// Configurations de Middlewares
import express from 'express';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { setupSwagger } from './swagger';
import morgan from 'morgan';
import helmet from 'helmet'
import cors from 'cors'
import cookieParser from 'cookie-parser';
import user from './routes/users-route';
import { envs } from './core/config/env';
import blog from './routes/blogs-route';
import { CronJob } from 'cron';
import usersControllers from './controllers/users-controllers';

const app = express();

// Securisations

// Configurations de securité
app.use(helmet()) //Pour configurer les entete http securisés

app.use(cors({
	methods: ['GET', 'POST', 'PUT', 'DELETE'],
	allowedHeaders: ['Content-Type', 'Authorization'],
	origin: 'http://localhost:3000',
	credentials: true,
})) // Pour gerer le partage des ressources de maniere securisée

// Configuration globaux de l'application express
app.use(express.json()); // parser les requets json
app.use(express.urlencoded({ extended: true })); // parser les requetes url encoder
app.use(compression()); //compression des requetes http
app.use(
	rateLimit({
		max: envs.MAX_GLOBAL_QUERY_NUMBER,
		windowMs: envs.MAX_GLOBAL_QUERY_WINDOW,
		message: 'Trop de Requete à partir de cette adresse IP !'
	})
);//limite le nombre de requete
app.use(cookieParser()); //configuration des cookies (JWT)

app.use(morgan('combined'));// Journalisation des requetes au format combined



// Routes du programme
app.use(
	"/user",
	rateLimit({
		max: envs.MAX_UNIQ_QUERY_NUMBER,
		windowMs: envs.MAX_UNIQ_QUERY_WINDOW,
		message: "Trop de requete à partir de cette addresse IP sur ce endPoint !"
	}),
	user
);

app.use(
	"/blog",
	rateLimit({
		max: envs.MAX_UNIQ_QUERY_NUMBER,
		windowMs: envs.MAX_UNIQ_QUERY_WINDOW,
		message: "Trop de requete à partir de cette addresse IP sur ce endPoint !"
	}),
	blog
);

//? Defines all My Jobs
new CronJob(
    '0 0 0 * * *', // cronTime
	async() => {
		await usersControllers.DeleteUNVERIFIED();
        console.log('Not verified user ddeleted !');
	},
	null, // onComplete
	true, // start
);


// Journalisations
app.use(morgan('combined'));

// Documentation
setupSwagger(app);

// Export application to app file
export default app;
