//â€“Đ°Đ±ĐľŃ‚Đ° Ń websocket-------------------------------------------------

vegaSocket = new WebSocket("ws://localhost:8002/ws")

vegaSocket.onopen = function() {
  alert("Соединение установлено!");
};

vegaSocket.onclose = function(event) {
  if (event.wasClean) {
	alert('Соединение закрыто!');
  } else {
	alert('Разрыв связи!');
  }
  alert('Код: ' + event.code + ' Причина: ' + event.reason);
};

function deviceListReceived(data){
	deviceList = document.getElementById("deviceList")

	
	data["devices_list"].forEach(function(element) {
	li = document.createElement("li")
	li.innerText = element.devName
	li.className = "list-group-item list-group-item-action"

	plot = document.createElement("div")
	plot.style.setProperty("width", "100%")
	plot.style.setProperty("height", "400px")
	plot.setAttribute("id", element.devEui + "_value")
	
	li.appendChild(plot)
	deviceList.appendChild(li)
	
	plot = document.createElement("div")
	plot.style.setProperty("width", "100%")
	plot.style.setProperty("height", "400px")
	plot.setAttribute("id", element.devEui + "_temp")

	li.appendChild(plot)
	deviceList.appendChild(li)

	devicesID_list.push(element.devEui)

	var trace = {
		y: [],
		type: 'scatter',
		name: "Вибрация"
	};

	var layout_vibro = {
		title: {
			text: 'Вибрация',
			font: {
				family: "Courier New, monospace",
				size: 24
			},
			xref: 'paper',
			x : 0.05,
		},
		xaxis:{
			title: {
				text: "Время, с",
				font: {
					family: "Courier New, monospace",
					size: 18,
					color: "#000000"
				},
			},
		},
		
		yaxis:{
			title: {
				text: "СКЗ, м/с",
				font: {
					family: "Courier New, monospace",
					size: 18,
					color: "#000000"
				},
			},
		}
	}
	
	var layout_temp = {
		title: {
			text: 'Температура',
			font: {
				family: "Courier New, monospace",
				size: 24
			},
			xref: 'paper',
			x : 0.05,
		},
		xaxis:{
			title: {
				text: "Время, с",
				font: {
					family: "Courier New, monospace",
					size: 18,
					color: "#000000"
				},
			},
		},
		
		yaxis:{
			title: {
				text: "Градусы, С",
				font: {
					family: "Courier New, monospace",
					size: 18,
					color: "#000000"
				},
			},
		}
	}
	
	var data = [trace];

	Plotly.newPlot(element.devEui + "_value", data, layout_vibro);	
	Plotly.newPlot(element.devEui + "_temp", data, layout_temp);
					  
	});
	
	setInterval(dataReceived, 1000)
}

//â€ŃĐ˝ĐşŃ†Đ¸Â¤ ĐľĐ±Ń€Đ°Đ±ĐľŃ‚ĐşĐ¸ Đ˛Ń…ĐľĐ´Â¤Ń‰Đ¸Ń… ŃĐľĐľĐ±Ń‰ĐµĐ˝Đ¸Đą
vegaSocket.onmessage = function(event) {
	  
  data = JSON.parse(event.data)
  
  if(data["cmd"] == "auth_resp")
  {
	if(data["status"] == true) setConnectStatus(true)
	else 					   setConnectStatus(false)
  }
  
  if (data["cmd"] == "get_device_appdata_resp")
  {
	deviceListReceived(data)
  }
  
};

vegaSocket.onerror = function(error) {
  alert("ŃśŃĐ¸Đ±ĐşĐ° " + error.message);
};

//-------------------------------------------------------------------

//Â«Đ°ĐżŃ€ĐľŃŃ‹ Đş ŃĐµŃ€Đ˛ĐµŃ€Ń--------------------------------------------------

//Ń•ĐľĐ»ŃŃ‡ĐµĐ˝Đ¸Đµ Đ´Đ°Đ˝Đ˝Ń‹Ń… ĐľŃ‚ ŃŃŃ‚Ń€ĐľĐąŃŃ‚Đ˛Đ°
function getData()
{
	/*
	Request message:
	{
		ĐŁdevEuiĐ¤: string,
		ĐŁselectĐ¤?: //[optional] Extra optional for searching
		{
			ĐŁdate_fromĐ¤?: integer, //[optional] server UTC timestamp as number (miliseconds from Linux epoch)
			ĐŁdate_toĐ¤?: integer, //[optional] server UTC timestamp as number (miliseconds from Linux epoch)
			ĐŁbegin_indexĐ¤?: integer, //[optional] begin index of data list [default = 0]
			ĐŁlimitĐ¤?: integer, //[optional] limit of response data list [default =1000]
			ĐŁportĐ¤?: integer, //[optional] select data with noted port
			ĐŁdirectionĐ¤?: string, //[optional] direction of message transition (see below description)
			ĐŁwithMacCommandsĐ¤?: boolean//[optional] add MAC commands to response
		}
	}*/
			
	var requestData = {}

	requestData["cmd"]	 		= "get_data_req"
	requestData["devEui"] 		= "3632333364374F18"
	
	requestData["select"] = {}
	requestData["select"]["begin_index"] = 0
	requestData["select"]["limit"]       = 100
	
	vegaSocket.send(JSON.stringify(requestData))
	
	var a = 5
}
	
//Ń•ĐľĐ»ŃŃ‡ĐµĐ˝Đ¸Đµ ŃĐżĐ¸ŃĐşĐ° ŃŃŃ‚Ń€ĐľĐąŃŃ‚Đ˛
function getDevicesList()
{
	var requestData = {}

	requestData["cmd"] 		= "get_device_appdata_req"
	
	vegaSocket.send(JSON.stringify(requestData))
	console.log("Â«Đ°ĐżŃ€ĐľŃ ŃŃŃ‚Ń€ĐľĐąŃŃ‚Đ˛ ĐľŃ‚ĐżŃ€Đ°Đ˛Đ»ĐµĐ˝")
}

function connect()
{
	
}

function auth()
{
	login 	 = document.getElementById("login").value
	password = document.getElementById("password").value
	
	
	if(login == "")
	{
		alert("ĐŚĐµ Đ·Đ°Đ´Đ°Đ˝Đľ Đ¸ĐĽÂ¤ ĐżĐľĐ»ŃŚĐ·ĐľĐ˛Đ°Ń‚ĐµĐ»Â¤")
		return
	}
	
	if(password == "")
	{
		alert("ĐŚĐµ Đ·Đ°Đ´Đ°Đ˝ ĐżĐ°Ń€ĐľĐ»ŃŚ")
		return
	}
	
	var authData = {}
	
	authData["cmd"] 		= "auth_req"
	authData["login"] 		= login
	authData["password"] 	= password
	
	vegaSocket.send(JSON.stringify(authData))
	console.log("Đ´Đ°Đ˝Đ˝Ń‹Đµ Đ°Đ˛Ń‚ĐľŃ€Đ¸Đ·Đ°Ń†Đ¸Đ¸ ĐľŃ‚ĐżŃ€Đ°Đ˛Đ»ĐµĐ˝Ń‹")
	
	/*
	data= {}
	data["devices_list"] = {}
	
	device = {}
	device["devName"] = "test1"
	
	deviceListReceived(data)*/
}