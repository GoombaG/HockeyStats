from NHLApiRequests.base import *

def _get_roster_url(team: str) -> str:
    return base_api_url + "v1/roster/" + team + "/current"

def fetch_roster_data(team: str) -> Response:
    return requests.get(_get_roster_url(team))