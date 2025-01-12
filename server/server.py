from flask import Flask, jsonify
from flask_cors import CORS
from NHLApiRequests.player import fetch_player_data
from NHLApiRequests.standings import fetch_standings_data
from NHLApiRequests.games import fetch_games_data

app = Flask(__name__)
cors = CORS(app, origins='*') # TODO: change 'origins'


@app.route("/players/<int:playerId>", methods=['GET'])
def player(playerId: int):
    playerData = fetch_player_data(playerId).json()
    return playerData

"""
@app.route("/streaks", methods=['GET'])
def streaks(playerId: int):
    data = fetch_streak_data().json()
    return data
"""

@app.route("/standings", methods=['GET'])
def standings():
    fullStandingsData = fetch_standings_data().json()
    standingsData = {}

    for teamData in fullStandingsData["standings"]:
        prunedTeamData = {
            "teamAbbrev": teamData["teamAbbrev"]["default"],
            "teamName": teamData["teamName"]["default"],
            "losses": teamData["losses"],
            "otLosses": teamData["otLosses"],
            "wins": teamData["wins"],
            "points": teamData["points"],
            "leagueSequence": teamData["leagueSequence"],
            "pointPctg": teamData["pointPctg"],
            "gamesPlayed": teamData["gamesPlayed"],
        }
        standingsData[prunedTeamData["teamAbbrev"]] = prunedTeamData

    return standingsData

@app.route("/completedGames", methods=['GET'])
def games(): 
    gamesData = {}
    fullStandingsData = fetch_standings_data().json() # just need the list of team abbreviations

    for teamData in fullStandingsData["standings"]:
        team = teamData["teamAbbrev"]["default"]

        fullTeamGamesData = fetch_games_data(team).json()
        teamGamesData = {}
        for gameData in fullTeamGamesData["games"]:
            gameState = gameData["gameState"]
            if gameState == "OFF" or gameState == "FINAL":
                prunedGameData = {
                    "awayAbbrev": gameData["awayTeam"]["abbrev"],
                    "homeAbbrev": gameData["homeTeam"]["abbrev"],
                    "awayLogo": gameData["awayTeam"]["logo"],
                    "homeLogo": gameData["homeTeam"]["logo"],
                    "awayScore": gameData["awayTeam"]["score"],
                    "homeScore": gameData["homeTeam"]["score"],
                    "lastPeriodType": gameData["gameOutcome"]["lastPeriodType"],
                    "gameDate": gameData["gameDate"],
                }
                teamGamesData[gameData["gameDate"]] = prunedGameData
        gamesData[team] = teamGamesData
    
    print(type(gamesData))
    #print(gamesData)
    return gamesData
                



if (__name__ == "__main__"):
    app.run(debug=True, port=8081)