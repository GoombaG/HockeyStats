from flask import Flask, jsonify
from flask_cors import CORS
from NHLApiRequests.player import fetch_player_data
from NHLApiRequests.standings import fetch_standings_data
from NHLApiRequests.games import fetch_games_data
from NHLApiRequests.roster import fetch_roster_data
from NHLApiRequests.game_log import fetch_game_log_data

app = Flask(__name__)
cors = CORS(app, origins='*') # TODO: change 'origins'

@app.route("/players/<int:playerId>", methods=['GET'])
def player(playerId: int):
    playerData = fetch_player_data(playerId).json()
    return playerData

def extractStreakData(playerGameData: list):
    parsedData = {
        "goalStreakLength" : 0,
        "goalStreak" : 0,
        "assistStreakLength" : 0,
        "assistStreak" : 0,
        "pointStreakLength" : 0,
        "pointStreak" : 0,
    }
    goalStreak = True
    assistStreak = True
    pointStreak = True
    
    for game in playerGameData:
        if goalStreak and game["goals"] > 0:
            parsedData["goalStreakLength"] += 1
            parsedData["goalStreak"] += game["goals"]
        else:
            goalStreak = False
        if assistStreak and game["assists"] > 0:
            parsedData["assistStreakLength"] += 1
            parsedData["assistStreak"] += game["assists"]
        else: 
            assistStreak = False
        if pointStreak and (game["goals"] > 0 or game["assists"]):
            parsedData["pointStreakLength"] += 1
            parsedData["pointStreak"] += game["goals"] + game["assists"]
        else:
            pointStreak = False

    return parsedData
    


def streakPlayerData(playerData: dict):
    print(playerData["id"])
    gameData = fetch_game_log_data(playerData["id"]).json()
    gameData = gameData["gameLog"]
    streakData = extractStreakData(gameData)

    prunedPlayer = {
        "id": playerData["id"],
        "firstName": playerData["firstName"]["default"],
        "lastName": playerData["lastName"]["default"],
        "position": playerData["positionCode"],
        "country": playerData["birthCountry"],
    }
    prunedPlayer.update(streakData)
    return prunedPlayer


@app.route("/streaks", methods=['GET'])
def streaks():
    standingsData = fetch_standings_data().json()
    players = {}

    standingsData = [standingsData["standings"][0]] # only use washington data so its faster for now
    for teamData in standingsData:
        rosterData = fetch_roster_data(teamData["teamAbbrev"]["default"]).json()
        for playerData in rosterData["forwards"]:
            prunedPlayer = streakPlayerData(playerData)
            players[prunedPlayer["id"]] = prunedPlayer
        for playerData in rosterData["defensemen"]:
            prunedPlayer = streakPlayerData(playerData)
            players[prunedPlayer["id"]] = prunedPlayer
        for playerData in rosterData["goalies"]:
            prunedPlayer = streakPlayerData(playerData)
            players[prunedPlayer["id"]] = prunedPlayer

    return players

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
                    "awayLogoDark": gameData["awayTeam"]["darkLogo"],
                    "homeLogoDark": gameData["homeTeam"]["darkLogo"],
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