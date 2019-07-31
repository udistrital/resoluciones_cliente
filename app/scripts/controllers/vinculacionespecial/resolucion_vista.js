'use strict';

/**
* @ngdoc function
* @name clienteApp.controller:ResolucionVistaCtrl
* @description
* # ResolucionVistaCtrl
* Controller of the clienteApp
*/
angular.module('contractualClienteApp')
  .controller('ResolucionVistaCtrl', function (administrativaRequest, oikosRequest,titandesagregRequest, coreRequest, adminMidRequest, pdfMakerService, nuxeoClient, $mdDialog, $scope, $http, $translate) {

    var self = this;
    var docentes_contratados = this;
    var docentes_desagregados = [];
    self.resolucion = JSON.parse(localStorage.getItem("resolucion"));
    

    /**
     * @name generarDocumentoPdfMake
     * @description
     * Realiza las consultas necesarias para armar el pdf con la información de las tablas resolucion y vinculacion_docente
     */
    self.generarDocumentoPdfMake = function () {
      

      if (self.resolucion.FechaExpedicion != undefined && self.resolucion.FechaExpedicion !== "0001-01-01T00:00:00Z") {
        self.resolucion.FechaExpedicion = new Date(self.resolucion.FechaExpedicion);
      }

      self.proyectos = [];
      oikosRequest.get("dependencia/proyectosPorFacultad/" + self.resolucion.IdFacultad + "/" + self.resolucion.NivelAcademico_nombre, "").then(function (response) {
        self.proyectos = response.data;
      });
      adminMidRequest.get("gestion_documento_resolucion/get_contenido_resolucion", "id_resolucion=" + self.resolucion.Id + "&id_facultad=" + self.resolucion.IdDependenciaFirma).then(function (response) {
        self.contenidoResolucion = response.data;
        adminMidRequest.get("gestion_previnculacion/docentes_previnculados_all", "id_resolucion=" + self.resolucion.Id).then(function (response) {
          self.contratados = response.data;
          // Si existen valores dentro de contratados se ejecuta la desagregación
          if (self.contratados.length > 0)
          {
            self.incluirDesagregacion(); 
          }else{
            self.generarResolucion();
          }
          
          
        });
      });
    };
 
    /**
    * @name incluirDesagregacion
    * @description 
    * Función que agrega los campos de la desagregación del salario de los docentes
    */
    self.incluirDesagregacion = function()
    {
      var contador = 0;
      var result_desagreg =[];
      

      for (let i = 0; i < self.contratados.length; i++) {

        const datosDocenteSalario = {
          NumDocumento:  Number(self.contratados[i].IdPersona),
          ValorTotalContrato: Number(self.contratados[i].ValorContratoFormato.replace(/[^0-9.-]+/g,"")),
          VigenciaContrato: self.resolucion.Vigencia,
        }

        titandesagregRequest.post('services/desagregacion_contrato_hcs',datosDocenteSalario).then(function(response) {
          var SalarioDesagreg = response.data;
          console.log(datosDocenteSalario.NumDocumento)
          console.log(self.contratados[i])
          console.log(SalarioDesagreg)

          result_desagreg = self.EscribirDesagregacion(self.contratados[i],SalarioDesagreg);
          console.log(result_desagreg)

          docentes_desagregados[i] = result_desagreg;
          

          if (docentes_desagregados.length == self.contratados.length)
          {
            console.log(self.contratados)
            console.log(docentes_desagregados)
            self.generarResolucion();
            
          }
         });

        
      }


    };
    
    /**
     * @name generarResolucion
     * @description 
     * Arma el documento con la información consultada y utiliza la herramienta pdfMake para mostrarlo
     */
    self.generarResolucion = function () {
      //console.log(docentes_desagregados)
      var documento = pdfMakerService.getDocumento(self.contenidoResolucion, self.resolucion, docentes_desagregados, self.proyectos);
      //Se hace uso de la libreria pdfMake para generar el documento y se asigna a la etiqueta con el id vistaPDF
      pdfMake.createPdf(documento).getDataUrl(function (outDoc) {
        document.getElementById('vistaPDF').src = outDoc;
      });
    };

    /**
     * @name consultarDocumentoNuxeo
     * @description
     * Consulta la tabla documento para buscar el id con que fue guardada la resolución en nuxeo y posteriormente lo busca para mostrarlo
     */
    self.consultarDocumentoNuxeo = function () {
      coreRequest.get('documento', $.param ({
        query: "Nombre:ResolucionDVE" + self.resolucion.Id,
        limit:0
      })).then(function(response) {
        if (response.data !== null) {
          var documentoResolucion = response.data[0];
          var idNuxeoResolucion = JSON.parse(documentoResolucion.Contenido).IdNuxeo;
          nuxeoClient.getDocument(idNuxeoResolucion).then(function(doc) {
            document.getElementById('vistaPDF').src = doc.url;
          });
        } else {
          self.generarDocumentoPdfMake();      
        }
      });
    };

    if (self.resolucion.Estado === "Expedida") {
      self.consultarDocumentoNuxeo();
    } else {
      self.generarDocumentoPdfMake();
    }

    /**
     * @name EscribirDesagregacion
     * @description 
     * Escribe los valores de desagregación en cada vector de docente
     */
    self.EscribirDesagregacion = function (docentes_recibido,desagregacion) {
      console.log(docentes_recibido)
      console.log(desagregacion)

      desagregacion.forEach(function(resultado_desagreg){

        switch (resultado_desagreg.Nombre){
          case "salarioBase":
            docentes_recibido.NSueldoBasico = "Sueldo Básico";
            docentes_recibido.SueldoBasico = (parseInt(resultado_desagreg.Valor)).toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
            });
            break;
          case "primaVacaciones":
            docentes_recibido.NPrimaVacaciones = "Prima de Vacaciones";
            docentes_recibido.PrimaVacaciones = (parseInt(resultado_desagreg.Valor)).toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
            });
            break;
          case "primaNavidad":
            docentes_recibido.NPrimaNavidad = "Prima de Navidad";
            docentes_recibido.PrimaNavidad = (parseInt(resultado_desagreg.Valor)).toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
            });
            break;
          case "primaServicios":
            docentes_recibido.NPrimaServicios = '';
            docentes_recibido.PrimaServicios = '';
          case "cesantias":
            docentes_recibido.NAportesCesantias = "Cesantías";
            docentes_recibido.AportesCesantias = (parseInt(resultado_desagreg.Valor)).toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
            });   
        }

      });
      
      docentes_recibido.NPrimaServicios="Prima de servicios";
      docentes_recibido.PrimaServicios='123';

      //console.log(docentes_recibido)

      return docentes_recibido;
    };

  });

