from flask import Flask, render_template, redirect, session,flash, request, jsonify
from boggle import Boggle
from flask_debugtoolbar import DebugToolbarExtension

app = Flask(__name__)
app.config['SECRET_KEY'] ='HIMOM'
app.debug = True
app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False
toolbar = DebugToolbarExtension(app)

boggle_game = Boggle()
sess_key = 'board'

@app.route('/')
def index():
    """Show homepage."""
    board = boggle_game.make_board()
    session[sess_key] = board
    highscore = session.get("highscore", 0)
    nplays = session.get("nplays", 0)
    return render_template("index.html",board=board, highscore=highscore, nplays=nplays )


@app.route('/word-checker')
def check_Word():
    """ checking if our word is in the dictionary."""
    word = request.args["word"]
    response = boggle_game.check_valid_word(session[sess_key], word)
    return jsonify({'result': response})


@app.route("/post-score", methods=["POST"])
def post_score():
    """Get score and update the # of plays, this will also update the highscore if a new one is availible """
    score = request.json["score"]
    highscore = session.get("highscore", 0)
    nplays = session.get("nplays", 0)

    session['nplays'] = nplays + 1
    session['highscore'] = max(score, highscore)

    return jsonify(brokeRecord=score > highscore)



