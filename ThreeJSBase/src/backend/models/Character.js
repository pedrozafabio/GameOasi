class Character {
	constructor(
		username,
		accessoryId,
		shirtId,
		pantsId,
		headId,
		faceId,
		skinId,
		role,
		itemsIdList,
		friends,
		photonId,
		logoutPos,
		sceneIndex,
		loggedIn,
		photoList,
		points,
		achievements,
		completedTutorial
	) {
		this.username = username;
		this.accessoryId = accessoryId;
		this.shirtId = shirtId;
		this.pantsId = pantsId;
		this.headId = headId;
		this.faceId = faceId;
		this.skinId = skinId;
		this.role = role;
		this.itemsIdList = itemsIdList;
		this.friends = friends;
		this.photonId = photonId;
		this.logoutPos = logoutPos;
		this.sceneIndex = sceneIndex;
		this.loggedIn = loggedIn;
		this.photoList = photoList;
		this.points = points;
		this.achievements = achievements;
		this.completedTutorial = completedTutorial;
	}
}

export default Alert;
