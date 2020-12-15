const fetch = require("node-fetch");

exports.getCharacter = async (id) => {
	let response = await fetch(process.env.BACKEND_URL + "characters/" + id, { method: "GET" });
	let responseData = await response.json();
	return responseData;
};

exports.getCharacters = async (id) => {
	let response = await fetch(process.env.BACKEND_URL + "characters", { method: "GET" });
	let responseData = await response.json();
	return responseData;
};

exports.createCharacter = async (character) => {
	let response = await fetch(process.env.BACKEND_URL + "characters", {
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json"
		},
		method: "POST",
		body: JSON.stringify(character)
	});
	let responseData = await response.json();
	return responseData;
};

exports.updateCharacter = async (character) => {
	let response = await fetch(process.env.BACKEND_URL + "characters/" + character.id, {
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json"
		},
		method: "PUT",
		body: JSON.stringify(character)
	});
	let responseData = await response.json();
	return responseData;
};

exports.deleteCharacter = async (id) => {
	let response = await fetch(process.env.BACKEND_URL + "characters/" + id, {
		method: "DELETE"
	});
	let responseData = await response.json();
	return responseData;
};
