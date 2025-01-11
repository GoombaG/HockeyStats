from NHLApiRequests.base import *

def _get_player_url(playerId: int) -> str:
    return base_api_url + "v1/player/" + str(playerId) + "/landing"

def fetch_player_data(playerId: int) -> Response:
    return requests.get(_get_player_url(playerId))