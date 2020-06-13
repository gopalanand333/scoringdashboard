sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
	"use strict";

	return Controller.extend("com.ag.scoring-dashboard.controller.ticketDetails", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.ag.scoring-dashboard.view.ticketDetails
		 */
		onInit: function () {
			this.oRouter = this.getOwnerComponent().getRouter();
			this.getView().setModel(new JSONModel(), "ticketDetailsModel");
			this.getOwnerComponent().getRouter().getRoute("ticketDetails").attachPatternMatched(this._onObjectMatched, this);
		},
		_onObjectMatched: function (oEvent) {
			this.ticketId = oEvent.getParameter("arguments").ticketId;

			this.loadTicketDetails(this.ticketId);
		},
		loadTicketDetails: function (ticketId) {
			var that = this;
			jQuery.ajax({
				type: "Get",
				url: "https://scoring-engine.cfapps.sap.hana.ondemand.com/getTicketDetails?ticketId=" + ticketId,
				success: function (data) {
					that.aggeregateData(data);
					that.getView().getModel("ticketDetailsModel").setData(data);
					that.getView().getModel("ticketDetailsModel").refresh(true);
				},
				error: function (data) {
					console.log(data);
				}
			});
		},
		aggeregateData: function (data) {
			this.getView().byId("ticketDetails").setTitle(data[data.length - 1].TICKET_ID);
			this.getView().byId("recentConv").setText(new Date(data[0].CONV_TIME).toLocaleDateString());
			var scoreAvg = 0;
			data.forEach(function (element) {
				scoreAvg = scoreAvg + element.SCORE;
			});
			this.getView().byId("avgTicketScore").setText((scoreAvg / data.length).toPrecision(2));
			this.getView().byId("avgTicketScore").setState(this.stateFormatter(scoreAvg/data.length));
			return;
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
		numberFormatter: function (number) {
			return parseFloat(number).toPrecision(2);
		},
		dateFormatter: function (dateString) {
			return new Date(dateString).toLocaleString();
		},
		navBack: function (oEvent) {
				window.history.go(-1);
			}
			/**
			 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
			 * (NOT before the first rendering! onInit() is used for that one!).
			 * @memberOf com.ag.scoring-dashboard.view.ticketDetails
			 */
			//	onBeforeRendering: function() {
			//
			//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf com.ag.scoring-dashboard.view.ticketDetails
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf com.ag.scoring-dashboard.view.ticketDetails
		 */
		//	onExit: function() {
		//
		//	}

	});

});