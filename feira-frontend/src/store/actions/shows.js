export const GET_SHOWS = "GET_SHOWS";

export function GetShows(stageId) {
	return async (dispatch) => {

        const BACKEND_ADDRESS = "https://api.oasi.vc";

        const config = { 
            method: "POST",
            headers:{
                "x-api-key": "Uj9ezKYeza5hTWmAD5HM466MiJkLph8u7GAjkdKU",
                "Content-Type": "application/json"
            }
        }

		const response = await fetch(BACKEND_ADDRESS + "/graph", config);

		const responseData = await response.json();

        console.log("API - Get Shows " + characterId);
        console.log(responseData);

		dispatch({
			type: GET_CHARACTER,
			character: responseData.data
		});
	};
}