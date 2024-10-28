

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI )

const mongooseSchema = new mongoose.Schema({
    title: String,
    year: Number,
    genres: [String],
    imdb: {
        rating: String,
        votes: Number,
        id: String,
    },
    poster: String,
}, {collection: 'movies'

});

const Movie = mongoose.model('Movie', mongooseSchema);

app.get('/api/movies/top100', async (req, res) => {
    try{
        const movies = await Movie.find({"imdb.rating": { $ne: ""}})
        .select('-_id title year genres imdb poster')
        .sort({imdb: -1})
        .limit(100);
        res.json(movies);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
    
});

app.get('/api/movies/top50/genre/:genre', async (req, res) => {
    try{
        const genre = req.params.genre;

        const movies = await Movie.find({
         genres: genre,
         "imdb.rating": { $ne: "" }
        })
        .select('-_id title year genres imdb poster')
        .sort({imdb: -1})
        .limit(50);
        res.json(movies);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
})


app.get('/api/movies/top25/year/:year', async (req, res) => {
    try{
        const year = req.params.year;

        const movies = await Movie.find({
         year: Number(year),
         "imdb.rating": { $ne: "" }
        })
        .select('-_id title year genres imdb poster')
        .sort({imdb: -1})
        .limit(25);
        res.json(movies);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
    });


app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
