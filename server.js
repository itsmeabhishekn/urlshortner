const express = require('express');
const mongoose = require('mongoose');
const ShortUrl = require('./models/shortUrl');
const app = express();

mongoose.connect('mongodb://localhost/urlShortener', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false })); // Add this line to parse form data

app.get('/', async (req, res) => {
    try {
        const shortUrlsData = await ShortUrl.find();
        res.render('index', { shortUrlsData: shortUrlsData });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

app.post('/shortUrls', async (req, res) => {
    try {
        await ShortUrl.create({ full: req.body.fullUrl });
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

app.get('/:shortUrl', async (req, res) => {
    const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl });
    if (shortUrl == null) return res.sendStatus(404)

    shortUrl.clicks++
    shortUrl.save()

    res.redirect(shortUrl.full)
});

app.listen(process.env.PORT || 9000, () => {
    console.log('Server is running on port 9000');
});
