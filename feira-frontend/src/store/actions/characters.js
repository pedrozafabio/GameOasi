export const GET_CHARACTER = "GET_CHARACTER";

export function GetCharacter(characterId) {
	return async (dispatch) => {

        const BACKEND_ADDRESS = "http://localhost:5000";

		const response = await fetch(BACKEND_ADDRESS + "/api/v1/characters/" + characterId, { method: "GET" });

		const responseData = await response.json();

        console.log("API - Get Character " + characterId);
        console.log(responseData);

		dispatch({
			type: GET_CHARACTER,
			character: responseData.data
		});
	};
}