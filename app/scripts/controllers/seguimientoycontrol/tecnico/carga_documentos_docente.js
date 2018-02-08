'use strict';

/**
 * @ngdoc function
 * @name contractualClienteApp.controller:CargaDocumentosDocenteCtrl
 * @description
 * # CargaDocumentosDocenteCtrl
 * Controller of the contractualClienteApp
 */
angular.module('contractualClienteApp')
  .controller('CargaDocumentosDocenteCtrl', function ($scope, $http, $translate, uiGridConstants, contratoRequest, administrativaRequest, nuxeo, $q, coreRequest, $window,$sce, adminMidRequest) {
    //Variable de template que permite la edición de las filas de acuerdo a la condición ng-if
  var tmpl = '<div ng-if="!row.entity.editable">{{COL_FIELD}}</div><div ng-if="row.entity.editable"><input ng-model="MODEL_COL_FIELD"</div>';

  //Se utiliza la variable self estandarizada
  var self = this;

  self.anios = [];

  self.meses = [{
      Id: 1,
      Nombre: $translate.instant('ENERO')
    },
    {
      Id: 2,
      Nombre: $translate.instant('FEBRERO')
    },
    {
      Id: 3,
      Nombre: $translate.instant('MARZO')
    },
    {
      Id: 4,
      Nombre: $translate.instant('ABRIL')
    },
    {
      Id: 5,
      Nombre: $translate.instant('MAYO')
    },
    {
      Id: 6,
      Nombre: $translate.instant('JUNIO')
    },
    {
      Id: 7,
      Nombre: $translate.instant('JULIO')
    },
    {
      Id: 8,
      Nombre: $translate.instant('AGOSTO')
    },
    {
      Id: 9,
      Nombre: $translate.instant('SEPT')
    },
    {
      Id: 10,
      Nombre: $translate.instant('OCTU')
    },
    {
      Id: 11,
      Nombre: $translate.instant('NOV')
    },
    {
      Id: 12,
      Nombre: $translate.instant('DIC')
    }
  ]
  /*
    Creación tabla que tendrá todos los contratos relacionados al docente
  */
  self.gridOptions1 = {
    enableSorting: true,
    enableFiltering: true,
    resizable: true,
    columnDefs: [{
        field: 'Resolucion',
        cellTemplate: tmpl,
        displayName: $translate.instant('RESOLUCION'),
        sort: {
          direction: uiGridConstants.ASC,
          priority: 1
        },
        width: "10%"
      },
      {
        field: 'Vigencia',
        cellTemplate: tmpl,
        displayName: $translate.instant('VIGENCIA'),
        sort: {
          direction: uiGridConstants.ASC,
          priority: 1
        },
        width: "10%"
      },
      {
        field: 'NumeroVinculacion',
        cellTemplate: tmpl,
        displayName: $translate.instant('NUM_VINC'),
        sort: {
          direction: uiGridConstants.ASC,
          priority: 1
        },
        width: "15%"
      },
      {
        field: 'Dedicacion',
        cellTemplate: tmpl,
        displayName: $translate.instant('DED'),
        sort: {
          direction: uiGridConstants.ASC,
          priority: 1
        },
        width: "10%"
      },
      {
        field: 'Dependencia',
        cellTemplate: tmpl,
        displayName: $translate.instant('PRO_CURR'),
        sort: {
          direction: uiGridConstants.ASC,
          priority: 1
        },
      },
      {
        field: 'IdDependencia',
        visible: false,
        cellTemplate: tmpl,
        displayName: "Id Dependencia",
      },
      {
        field: 'Acciones',
        displayName: $translate.instant('ACC'),
        cellTemplate: '<a type="button" title="{{\'SOLICITAR_CUM\'| translate }}" type="button" class="fa fa-money fa-lg  faa-shake animated-hover" data-toggle="modal" data-target="#modal_ver_soportes" >' +
          '</a>&nbsp;' + ' <a type="button" title="{{\'CARGAR_LISTAS\'| translate }}" type="button" class="fa fa-upload fa-lg  faa-shake animated-hover" ng-click="grid.appScope.cargaDocumentosDocente.cargar_soportes(row.entity)"  data-toggle="modal" data-target="#modal_carga_listas_docente">',
        width: "10%"
      }
    ]
  };



  self.gridOptions1.onRegisterApi = function(gridApi) {
    self.gridApi = gridApi;
  };

  /*
    Enviar solicitud de revisión de soportes a Coordinador
  */
  self.enviar_revision = function (solicitud) {
    swal({
      title: '¿Está seguro(a) de enviar a revisar los soportes por el coordinador?',
      text: "No podrá revertir la validación",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Enviar'
    }).then(function () {
      console.log(solicitud);
      self.jsonActualizado = solicitud;
      console.log(self.jsonActualizado);
      self.jsonActualizado.EstadoPagoMensual = {"Id":1};
      console.log(self.jsonActualizado);
      administrativaRequest.put('pago_mensual', solicitud.Id, self.jsonActualizado).
      then(function(response){
        console.log("Se realizó cambio de estado en la solicutd");
      })
      self.gridApi.core.refresh();

    });
  };
  /*
    Creación tabla que tendrá las solicitudes de pago de cada contrato
  */
  self.gridOptions2 = {
    enableSorting: true,
    enableFiltering: true,
    resizable: true,
    enableRowSelection: true,
    columnDefs: [{
        field: 'NumeroContrato',
        cellTemplate: tmpl,
        displayName: $translate.instant('NUM_VINC'),
        sort: {
          direction: uiGridConstants.ASC,
          priority: 1
        },
      },
      {
        field: 'VigenciaContrato',
        cellTemplate: tmpl,
        displayName: $translate.instant('VIGENCIA'),
        sort: {
          direction: uiGridConstants.ASC,
          priority: 1
        },
      },
      {
        field: 'Mes',
        cellTemplate: tmpl,
        displayName: $translate.instant('MES'),
        sort: {
          direction: uiGridConstants.ASC,
          priority: 1
        },
      },
      {
        field: 'Ano',
        cellTemplate: tmpl,
        displayName: $translate.instant('ANO'),
        sort: {
          direction: uiGridConstants.ASC,
          priority: 1
        },
      },
      {
        field: 'EstadoPagoMensual.Nombre',
        cellTemplate: tmpl,
        displayName: $translate.instant('EST_SOL'),
        sort: {
          direction: uiGridConstants.ASC,
          priority: 1
        },
      },
      {
        field: 'Acciones',
        displayName: $translate.instant('ACC'),
        cellTemplate: '<a type="button" title="{{\'VER_SOP\'| translate }}" type="button" class="fa fa-folder-open-o fa-lg  faa-shake animated-hover" ng-click="grid.appScope.cargaDocumentosDocente.visualizar_docs(row.entity)" data-toggle="modal" data-target="#modal_carga_listas_docente">' +
          '</a>&nbsp;' + ' <a type="button" title="{{\'ENV_REV\'| translate }}" type="button" class="fa fa-send-o fa-lg  faa-shake animated-hover" ng-click="grid.appScope.cargaDocumentosDocente.enviar_revision(row.entity)"  >',
        width: "10%"
      }
    ]
  };

  //No permite poder hacer multiples selecciones en la grilla
  self.gridOptions2.multiSelect = false;
  /*
    Función para obtener la data de la fila seleccionada en la grilla
  */
  self.gridOptions2.onRegisterApi = function(gridApi) {
    self.gridApi2 = gridApi;
    self.seleccionados = self.gridApi2.selection.selectedCount;
    self.gridApi2.selection.on.rowSelectionChanged($scope, function(row) {
      //Contiene la info del elemento seleccionado
      self.seleccionado = row.isSelected;
      //Condiciuonal para capturar la información de la fila seleccionado
      if (self.seleccionado) {
        self.fila_seleccionada = row.entity;
        self.obtener_doc();
      }
    });
  };

  /*
    Función para consultar los datos del docente y los contratos asociados a este
  */
  self.obtener_informacion_docente = function() {
    //Petición para obtener la información del docente
    self.gridOptions1.data = [];
    self.contratos = [];
      //Petición para obtener las vinculaciones del docente
      adminMidRequest.get('aprobacion_pago/get_contratos_docente/' + self.Documento)
      .then(function(response) {
        if(self.respuesta_docente !== null || self.respuesta_docente !== undefined){
          //Contiene la respuesta de la petición
          self.respuesta_docente = response.data;
          //Variable que contiene el nombre del docente
          self.nombre_docente = self.respuesta_docente[0].NombreDocente;
          //Carga la información en la tabla
          self.gridOptions1.data = self.respuesta_docente;
        }else{
          alert("No se encontraron vinculaciones vigentes asociadas a su número de documento");
        }

      });
      console.log("Este es el resultado " + self.respuesta_docente);
    self.gridApi2.core.refresh();
  };

  /*
  Función que permite realizar una solicitud de pago mensual
  */
  self.solicitar_pago = function(contrato) {
    self.contrato = contrato;
    self.anios = [parseInt(self.contrato.Vigencia) - 1, parseInt(self.contrato.Vigencia), parseInt(self.contrato.Vigencia) + 1];
    self.obtener_informacion_coordinador(self.contrato.IdDependencia);
  };


  self.cargar_soportes = function(contrato) {
    self.seleccionado = false;
    self.gridOptions2.data = [];
    self.contrato = contrato;
    administrativaRequest.get("pago_mensual", $.param({
      query: "NumeroContrato:" + self.contrato.NumeroVinculacion + ",VigenciaContrato:" + self.contrato.Vigencia,
      limit: 0
    })).then(function(response) {

      contratoRequest.get('contrato_elaborado', self.contrato.NumeroVinculacion + '/' + self.contrato.Vigencia).then(function(response_ce) {

        self.tipo_contrato = response_ce.data.contrato.tipo_contrato;
      console.log(response_ce.data);

        administrativaRequest.get("item_informe_tipo_contrato", $.param({
          query: "TipoContrato:" + self.tipo_contrato,
          limit: 0
        })).then(function(response_iitc) {

          self.items = response_iitc.data;
          console.log(self.items);

        });

      });

      self.gridOptions2.data = response.data;
      console.log(self.gridOptions2.data);

    });
  };

  self.obtener_informacion_coordinador = function(IdDependencia){
    adminMidRequest.get('aprobacion_pago/informacion_coordinador/'+ IdDependencia)
    .then(function(response){
      self.informacion = response.data;
      self.informacion_coordinador = self.informacion.carreraSniesCollection.carreraSnies[0];
      console.log(self.informacion_coordinador);
    })
  };


  self.enviar_solicitud = function() {

    if (self.mes !== undefined && self.anio !== undefined) {
      //Petición para obtener id de estado pago mensual
      administrativaCrudService.get("estado_pago_mensual", $.param({
          query: "CodigoAbreviacion:CD",
          limit: 0
        })).then(function (response) {


      var pago_mensual = {
        CargoResponsable: "COORDINADOR " + self.contrato.Dependencia,
        EstadoPagoMensual: {
          Id: 2
        },
        FechaModificacion: new Date(),
        Mes: self.mes,
        Ano: self.anio,
        NumeroContrato: self.contrato.NumeroVinculacion,
        Persona: self.Documento,
        Responsable: self.informacion_coordinador.numero_documento_coordinador,
        VigenciaContrato: parseInt(self.contrato.Vigencia)
      };

      administrativaRequest.get("pago_mensual", $.param({
        query: "NumeroContrato:" + self.contrato.NumeroVinculacion +
          ",VigenciaContrato:" + self.contrato.Vigencia +
          ",Mes:" + self.mes +
          ",Ano:" + self.anio,
        limit: 0
      })).then(function(response) {

        if (response.data == null) {

          administrativaRequest.post("pago_mensual", pago_mensual).then(function(response) {

            console.log(response.data);
            swal(
              'Solicitud registrada',
              'Por favor cargue los soportes correspondientes',
              'success'
            )

            self.contrato = {};

          });

        } else {

          swal(
            'Error',
            'Ya existe una solicitud de pago para el año y mes dados',
            'error'
          );

        }

      });



      //  console.log(pago_mensual);
    });
  }else {
      swal(
        'Error',
        'Debe seleccionar un mes y un año',
        'error'
      );
    }

  };

  /*
    Función para cargar los documentos a la carpeta  destino
  */
  self.cargarDocumento = function(nombre, descripcion, documento, callback) {
    var defered = $q.defer();
    var promise = defered.promise;

    nuxeo.operation('Document.Create')
      .params({
        type: 'File',
        name: nombre,
        properties: 'dc:title=' + nombre + ' \ndc:description=' + descripcion
      })
      .input('/default-domain/workspaces/Titán')
      .execute()
      .then(function(doc) {
        var nuxeoBlob = new Nuxeo.Blob({
          content: documento
        });
        nuxeo.batchUpload()
          .upload(nuxeoBlob)
          .then(function(res) {
            return nuxeo.operation('Blob.AttachOnDocument')
              .param('document', doc.uid)
              .input(res.blob)
              .execute();
          })
          .then(function() {
            return nuxeo.repository().fetch(doc.uid, {
              schemas: ['dublincore', 'file']
            });
          })
          .then(function(doc) {
            var url = doc.uid;
            callback(url);
            defered.resolve(url);
          })
          .catch(function(error) {
            throw error;
            defered.reject(error)
          });
      })
      .catch(function(error) {
        throw error;
        defered.reject(error)
      });

    return promise;
  }

  self.subir_documento = function() {

    var nombre_doc = self.contrato.Vigencia + self.contrato.NumeroVinculacion + self.Documento + self.fila_seleccionada.Mes + self.fila_seleccionada.Ano;
    var descripcion = self.item.ItemInforme.Nombre;

    if (self.archivo) {
      var aux = self.cargarDocumento(nombre_doc, descripcion, self.fileModel, function(url) {

        //Objeto documento
        self.objeto_documento = {
          "Nombre": nombre_doc,
          "Descripcion": descripcion,
          "TipoDocumento": {
            "Id": 3
          },
          "Contenido": JSON.stringify({
            "Tipo": "Archivo",
            "IdNuxeo": url,
            "Observaciones": self.observaciones
          }),
          "Activo": true
        };

        console.log(self.objeto_documento);

        //Post a la tabla documento del core
        coreRequest.post('documento', self.objeto_documento)
          .then(function(response) {
            self.id_documento = response.data.Id;

            //Objeto soporte_pago_mensual
            self.objeto_soporte = {
              "PagoMensual": {
                "Id": self.fila_seleccionada.Id
              },
              "Documento": self.id_documento,
              "ItemInformeTipoContrato": {
                "Id": self.item.Id
              },
              "Aprobado": false
            };

            //Post a la tabla soporte documento
            administrativaRequest.post('soporte_pago_mensual', self.objeto_soporte)
              .then(function(response) {
                //Bandera de validacion
                console.log("Se ha registrado el documento en el soporte mensual");
              });
          });


      });

    } else if (self.link) {


      //Objeto documento
      self.objeto_documento = {
        "Nombre": nombre_doc,
        "Descripcion": descripcion,
        "TipoDocumento": {
          "Id": 3
        },
        "Contenido": JSON.stringify({
          "Tipo": "Enlace",
          "Enlace": self.enlace,
          "Observaciones": self.observaciones
        }),
        "Activo": true
      };

      console.log(self.objeto_documento);

      //Post a la tabla documento del core
      coreRequest.post('documento', self.objeto_documento)
        .then(function(response) {
          self.id_documento = response.data.Id;

          //Objeto soporte_pago_mensual
          self.objeto_soporte = {
            "PagoMensual": {
              "Id": self.fila_seleccionada.Id
            },
            "Documento": self.id_documento,
            "ItemInformeTipoContrato": {
              "Id": self.item.Id
            },
            "Aprobado": false
          };

          //Post a la tabla soporte documento
          administrativaRequest.post('soporte_pago_mensual', self.objeto_soporte)
            .then(function(response) {
              //Bandera de validacion
              console.log("Se ha registrado el documento en el soporte mensual");
            });
        });

    }


  };


  self.cambiarCheckArchivo = function() {
    if (self.archivo) {
      self.link = false;
    }
  };

  self.cambiarCheckLink = function() {
    if (self.link) {
      self.archivo = false;
    }
  };

  /*
    Función que permite obtener un documento de nuxeo por el Id
  */
  self.getDocumento = function(docid){
   nuxeo.header('X-NXDocumentProperties', '*');

   self.obtenerDoc = function () {
     var defered = $q.defer();

     nuxeo.request('/id/'+docid)
         .get()
         .then(function(response) {
           self.doc=response;
           var aux=response.get('file:content');
           self.document=response;
           defered.resolve(response);
         })
         .catch(function(error){
             defered.reject(error)
         });
     return defered.promise;
   };

   self.obtenerFetch = function (doc) {
     var defered = $q.defer();

     doc.fetchBlob()
       .then(function(res) {
         defered.resolve(res.blob());

       })
       .catch(function(error){
             defered.reject(error)
         });
     return defered.promise;
   };

     self.obtenerDoc().then(function(){

        self.obtenerFetch(self.document).then(function(r){
            self.blob=r;
            var fileURL = URL.createObjectURL(self.blob);
            console.log(fileURL);
            self.content = $sce.trustAsResourceUrl(fileURL);
            $window.open(fileURL);
         });
     });
   };

   /*
    Función que obtiene los documentos relacionados a las solicitudes
   */
   self.obtener_doc = function (){
     console.log(self.fila_seleccionada);
     var nombre_docs = self.contrato.Vigencia + self.contrato.NumeroVinculacion + self.Documento + self.fila_seleccionada.Mes + self.fila_seleccionada.Ano;
     coreRequest.get('documento', $.param ({
      query: "Nombre:" + nombre_docs,
      limit:0
    })).then(function(response){
      self.documentos = response.data;
      angular.forEach(self.documentos, function(value) {
        self.descripcion_doc = value.Descripcion;
        console.log(self.descripcion_doc);
        var json = value.Contenido;
        var desJson = JSON.parse(json)

        if (desJson.Tipo == "Archivo") {
          self.getDocumento(desJson.IdNuxeo)
        }else{
          console.log("Este es el enlace " + desJson.Enlace);
        }

      });

    })


   }
  });