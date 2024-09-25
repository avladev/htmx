import express from 'express';

const app = express();
const GOALS = [
    {id: 1, text:'Test goal'},
    {id: 2, text:'Test goal 2'},
    {id: 3, text:'Test goal 3'},
];


function goalItem(goal) {
  return `
    <li id="goal-${goal.id}">${goal.text}
        <a
        hx-delete="/goal/${goal.id}"
        hx-target="#goal-${goal.id}"
        hx-swap="outerHTML"
        hx-confirm="Are you sure you want to delete?">Delete</a>
    </li>`;
}

app.use(express.urlencoded({extended: false}));
app.use(express.static('public'));

app.delete("/goal/:id", (req, res) => {
    if (req.params.idx) {
        GOALS.splice(req.params.id, 1);
    }
    res.send("");
})

app.post("/goal", (req, res) => {
    if (req.method === 'POST' && req.body.data) {
        GOALS.unshift({id: new Date().getTime(), text: req.body.data});
    }

    setTimeout(() => {
        res.redirect('/goals')
    }, 2000);
});


app.get("/goals", (req, res) => {
    res.send(`
        <form 
            hx-post="/goal" 
            hx-target="#content"
            hx-disabled-elt="this"
        >
            <label>What's your name?</label>
            <input name="data" type="text" />
            <button type="submit">Save</button>
        </form>
        <hr>
        <h1>Data:</h1>
        <ul>
            ${GOALS.map(info => goalItem(info)).join('\n')}
        </ul>
    `)
});

app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <title>HTMX Essentials</title>
        <link rel="icon" href="/icon.png" />
        <script src="/htmx.js" defer></script>
        <link rel="stylesheet" href="/main.css" />
      </head>
      <body>
        <main>
          <button hx-get="/goals" hx-target="#content">View Goals</button>
          <div id="content"></div>
        </main>
      </body>
    </html>
  `);
});

app.listen(3000);
