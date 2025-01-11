from NHLApiRequests.base import *

def _get_standings_url() -> str:
    return base_api_url + "v1/standings/now"

def fetch_standings_data() -> Response:
    return requests.get(_get_standings_url())