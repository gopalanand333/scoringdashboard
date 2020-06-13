sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
	"use strict";

	return Controller.extend("com.ag.scoring-dashboard.controller.home", {
		onInit: function () {
			var model = new JSONModel();
			this.oRouter = this.getOwnerComponent().getRouter();
			this.getView().setModel(model, "ticketModel");
			var component = new JSONModel();
			this.getView().setModel(component, "componentModel");
			this.getView().setModel(new JSONModel(), "dailyAvgModel");
			this.loadData();
		},
		loadData: function () {
			var that = this;
			setInterval(function () {
				that.averageData();
				that.getTicketData();
				that.getComponentData();
				that.getDailyAvg();
			}, 10000);
		},
		averageData: function () {
			var that = this;
			this.getView().byId("Accent1").setBusy(true);
			jQuery.ajax({
				type: "Get",
				url: "https://scoring-engine.cfapps.sap.hana.ondemand.com/getAverageScore",
				success: function (data) {
					that.getView().byId("scoreTitle").setText(data[0].SCORE.toPrecision(2));

					var src = that.formatImages(parseFloat(data[0].SCORE.toPrecision(2)));
					that.getView().byId("scoreEmoji").setSrc(src);
					that.getView().byId("Accent1").setBusy(false);
				},
				error: function (data) {
					console.log(data);
				}
			});
		},
		getTicketData: function () {
			var that = this;
			this.getView().byId("Accent1").setBusy(true);
			jQuery.ajax({
				type: "Get",
				url: "https://scoring-engine.cfapps.sap.hana.ondemand.com/ticketScore",
				success: function (data) {
					that.getView().getModel("ticketModel").setData(data);
					that.getView().getModel("ticketModel").refresh(true);
				},
				error: function (data) {
					console.log(data);
				}
			});
		},
		getComponentData: function () {
			var that = this;
			this.getView().byId("Accent1").setBusy(true);
			jQuery.ajax({
				type: "Get",
				url: "https://scoring-engine.cfapps.sap.hana.ondemand.com/getComponentScore",
				success: function (data) {
					that.getView().getModel("componentModel").setData(data);
					that.getView().getModel("componentModel").refresh(true);
				},
				error: function (data) {
					console.log(data);
				}
			});
		},
		getDailyAvg: function () {
			this.getView().byId("microchart").setBusy(true);
			var that = this;
			jQuery.ajax({
				type: "Get",
				url: "https://scoring-engine.cfapps.sap.hana.ondemand.com/getDailyAvg",
				success: function (data) {
					that.getView().getModel("dailyAvgModel").setData(data);
					that.getView().getModel("dailyAvgModel").refresh(true);
					that.getView().byId("microchart").setBusy(false);
				},
				error: function (data) {
					console.log(data);
				}
			});
		},
		formatImages: function (score) {
			var src;
			if (score > 1) {
				src = "images/veryhappy.png";
			} else if (score > 0 && score <= 1) {
				src = "images/happy.png";
			} else if (score > -0.5 && score <= 0) {
				src = "images/ok.png";
			} else if (score <= -0.5 && score > -1.0) {
				src = "images/sad.png";
			} else if (score <= -1.0) {
				src = "images/verysad.png";
			}
			return src;
		},
		stateFormatter: function (s) {
			var score = parseFloat(s.toPrecision(2));
			var src;
			if (score > 1) {
				src = "Success";
			} else if (score > 0 && score <= 1) {
				src = "Information";
			} else if (score > -0.5 && score <= 0) {
				src = "None";
			} else if (score <= -0.5 && score > -1.0) {
				src = "Warning";
			} else if (score <= -1.0) {
				src = "Error";
			}
			return src;
		},
		microShartFormatter: function (s) {
			var score = parseFloat(s.toPrecision(2));
			var src;
			if (score > 1) {
				src = "Good";
			} else if (score > 0 && score <= 1) {
				src = "Good";
			} else if (score > -0.5 && score <= 0) {
				src = "Neutral";
			} else if (score <= -0.5 && score > -1.0) {
				src = "Critical";
			} else if (score <= -1.0) {
				src = "Error";
			}
			return src;
		},
		/** Events*/
		productPress: function (oEvent) {
			var product = oEvent.getSource().getProperty("title");
			this.oRouter.navTo("master", {
				productId: product
			});
		},
		navToTicketDetails: function (oEvent) {
			var ticketId= oEvent.getSource().getProperty("title");
			this.oRouter.navTo("ticketDetails", {
				ticketId: ticketId
			});
		}

	});
});