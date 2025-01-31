from NHLApiRequests.base import *

def _get_game_log_url(player: int) -> str:
    return base_api_url + "v1/player/" + str(player) + "/game-log/20242025/2"

def fetch_game_log_data(player: int) -> Response:
    return requests.get(_get_game_log_url(player))