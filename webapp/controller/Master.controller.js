sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
	"use strict";

	return Controller.extend("com.ag.scoring-dashboard.controller.Master", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.ag.scoring-dashboard.view.Master
		 */
		onInit: function () {
			this.getView().setModel(new JSONModel(), "subProductModel");
			this.getView().setModel(new JSONModel(), "componentTickets");
			this.oRouter = this.getOwnerComponent().getRouter();
			this.getOwnerComponent().getRouter().getRoute("master").attachPatternMatched(this._onObjectMatched, this);
		},
		_onObjectMatched: function (oEvent) {
			this.product = oEvent.getParameter("arguments").productId;
			this.getView().byId("subproductPanel").setHeaderText(this.product + "- Component wise score");
			this.loadCompData(this.product);
			this.loadCompTickets(this.product);
		},
		loadCompData: function (product) {
			var that = this;
			this.getView().setBusy(true);
			jQuery.ajax({
				type: "Get",
				url: "https://scoring-engine.cfapps.sap.hana.ondemand.com/productDetails?product=" + product,
				success: function (data) {
					that.getView().getModel("subProductModel").setData(data);
					that.getView().getModel("subProductModel").refresh(true);
						that.getView().setBusy(false);
				},
				error: function (data) {
					console.log(data);
							that.getView().setBusy(false);
				}
			});
		},
		loadCompTickets: function (product) {
			var that = this;
			jQuery.ajax({
				type: "Get",
				url: "https://scoring-engine.cfapps.sap.hana.ondemand.com/componentTickets?product=" + product,
				success: function (data) {
					that.getView().getModel("componentTickets").setData(data);
					that.getView().getModel("componentTickets").refresh(true);
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

		navBack: function (oevent) {
			this.getOwnerComponent().getRouter().navTo("Routehome");
		},
		navToTicketDetails: function (oEvent) {
			var ticketId = oEvent.getSource().getProperty("title");
			this.oRouter.navTo("ticketDetails", {
				ticketId: ticketId
			});
		},
		subcomponentPress: function (oEvent) {
			var component = oEvent.getSource().getProperty("title");
			this.oRouter.navTo("handlers", {
				componentId: component
			});
		}

		/**
		 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
		 * (NOT before the first rendering! onInit() is used for that one!).
		 * @memberOf com.ag.scoring-dashboard.view.Master
		 */
		//	onBeforeRendering: function() {
		//
		//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf com.ag.scoring-dashboard.view.Master
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf com.ag.scoring-dashboard.view.Master
		 */
		//	onExit: function() {
		//
		//	}

	});

});