const getID = () => {
	if (typeof crypto !== "undefined" && crypto.randomUUID) {
		return crypto.randomUUID();
	}
	// Запасной вариант (v4 UUID)
	return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
		(c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16),
	);
};

$(document).ready(function () {
	function getAuth() {
		const instance = $("#idInstance").val();
		const token = $("#apiTokenInstance").val();
		return btoa(String.fromCharCode(...new TextEncoder().encode(JSON.stringify({ instance, token }))));
	}

	function showResponse(xhr) {
		try {
			// Парсим ответ как JSON
			const data = JSON.parse(xhr.responseText);
			// Красиво форматируем и выводим
			$("#result").text(JSON.stringify(data, null, 2));
		} catch (_) {
			// Если не JSON — просто выводим текст
			$("#result").text(xhr.responseText);
		}
	}

	$("#getSettings").on("click", function () {
		$.ajax({
			url: "/api/settings",
			type: "GET",
			headers: {
				"X-API-AUTH": getAuth(),
			},
			complete: function (xhr) {
				showResponse(xhr);
			},
		});
	});

	$("#getStateInstance").on("click", function () {
		$.ajax({
			url: "/api/settings/instance",
			type: "GET",
			headers: {
				"X-API-AUTH": getAuth(),
			},
			complete: function (xhr) {
				showResponse(xhr);
			},
		});
	});

	$("#sendMessage").on("click", function () {
		const chatId = $("#messageTarget").val() + "@c.us";
		const message = $("#messageText").val();

		$.ajax({
			url: "/api/message",
			type: "POST",
			headers: {
				"X-API-AUTH": getAuth(),
			},
			data: {
				chatId,
				message,
			},
			complete: function (xhr) {
				showResponse(xhr);
			},
		});
	});

	$("#sendFileByUrl").on("click", function () {
		const chatId = $("#fileTarget").val() + "@c.us";
		const urlFile = $("#fileUrl").val();

		$.ajax({
			url: "/api/message/filebyurl",
			type: "POST",
			headers: {
				"X-API-AUTH": getAuth(),
			},
			data: {
				chatId,
				urlFile,
				fileName: `file_${getID()}.jpg`,
			},
			complete: function (xhr) {
				showResponse(xhr);
			},
		});
	});
});
