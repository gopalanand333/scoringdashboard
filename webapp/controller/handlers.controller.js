sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
	"use strict";

	return Controller.extend("com.ag.scoring-dashboard.controller.handlers", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf com.ag.scoring-dashboard.view.handlers
		 */
		onInit: function () {
			this.getView().setModel(new JSONModel(),"handlerModel");
			this.oRouter = this.getOwnerComponent().getRouter();
			this.getOwnerComponent().getRouter().getRoute("handlers").attachPatternMatched(this._onObjectMatched, this);
		},
		_onObjectMatched: function (oEvent) {
			this.componentId = oEvent.getParameter("arguments").componentId;
			this.getView().setBusy(true);
			this.loadCompData(this.componentId);
		},
		loadCompData: function (componentId) {
			var that = this;
			
			jQuery.ajax({
				type: "Get",
				url: "https://scoring-engine.cfapps.sap.hana.ondemand.com/getSubcomponentHandlers?subcomponent=" + componentId,
				success: function (data) {
					that.getView().getModel("handlerModel").setData(data);
					that.getView().getModel("handlerModel").refresh(true);
					that.getView().setBusy(false);
				},
				error: function (data) {
					that.getView().setBusy(false);
					console.log(data);
				}
			});
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
		navBack: function (oEvent) {
				window.history.go(-1);
			}
			/**
			 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
			 * (NOT before the first rendering! onInit() is used for that one!).
			 * @memberOf com.ag.scoring-dashboard.view.handlers
			 */
			//	onBeforeRendering: function() {
			//
			//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf com.ag.scoring-dashboard.view.handlers
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf com.ag.scoring-dashboard.view.handlers
		 */
		//	onExit: function() {
		//
		//	}

	});

});