from NHLApiRequests.base import *

def _get_games_data_url(team: str) -> str:
    return base_api_url + "v1/club-schedule-season/" + team + "/20242025"

def fetch_games_data(team: str) -> Response:
    return requests.get(_get_games_data_url(team))