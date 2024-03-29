'use strict';

/**
* @ngdoc function
* @name clienteApp.controller:ResolucionGestionCtrl
* @description
* # ResolucionGestionCtrl
* Controller of the clienteApp
*/
angular.module('resolucionesClienteApp')
  .factory("resolucion", function () {
    return {};
  })
  .controller('ResolucionGestionCtrl', function (resolucionesMidRequest, resolucion, resolucionRequest, $scope, $window, $mdDialog, $translate, gridApiService) {

    var self = this;
    $scope.offset = 0;
    $scope.query = "";
    self.CurrentDate = new Date();

    //Tabla para mostrar los datos básicos de las resoluciones almacenadas dentro del sistema
    self.resolucionesInscritas = {
      paginationPageSizes: [10, 15, 20],
      paginationPageSize: 10,
      enableSorting: true,
      enableFiltering: true,
      enableRowSelection: false,
      enableRowHeaderSelection: false,
      useExternalPagination: true,
      useExternalSorting: true,
      useExternalFiltering: true,
      columnDefs: [
        {
          field: 'Id',
          visible: false
        },
        {
          field: 'FechaExpedicion',
          visible: false
        },
        {
          field: 'Facultad',
          visible: false
        },
        {
          field: 'Numero',
          cellClass: function (grid, row/*, col, rowRenderIndex, colRenderIndex*/) {
            if (row.entity.Estado === "Cancelada") {
              return 'resolucionCancelada';
            } else if (row.entity.Estado === "Expedida") {
              return 'resolucionExpedida';
            }
          },
          width: '10%',
          displayName: $translate.instant('NUMERO')
        },
        {
          field: 'Vigencia',
          cellClass: function (grid, row/*, col, rowRenderIndex, colRenderIndex*/) {
            if (row.entity.Estado === "Cancelada") {
              return 'resolucionCancelada';
            } else if (row.entity.Estado === "Expedida") {
              return 'resolucionExpedida';
            }
          },
          width: '8%',
          displayName: $translate.instant('VIGENCIA')
        },
        {
          field: 'Periodo',
          cellClass: function (grid, row/*, col, rowRenderIndex, colRenderIndex*/) {
            if (row.entity.Estado === "Cancelada") {
              return 'resolucionCancelada';
            } else if (row.entity.Estado === "Expedida") {
              return 'resolucionExpedida';
            }
          },
          width: '8%',
          displayName: $translate.instant('PERIODO')
        },
        {
          field: 'FacultadNombre',
          enableFiltering: false,
          cellClass: function (grid, row/*, col, rowRenderIndex, colRenderIndex*/) {
            if (row.entity.Estado === "Cancelada") {
              return 'resolucionCancelada';
            } else if (row.entity.Estado === "Expedida") {
              return 'resolucionExpedida';
            }
          },
          width: '18%',
          displayName: $translate.instant('FACULTAD')
        },
        {
          field: 'NivelAcademico',
          cellClass: function (grid, row/*, col, rowRenderIndex, colRenderIndex*/) {
            if (row.entity.Estado === "Cancelada") {
              return 'resolucionCancelada';
            } else if (row.entity.Estado === "Expedida") {
              return 'resolucionExpedida';
            }
          },
          width: '8%',
          displayName: $translate.instant('NIVEL')
        },
        {
          field: 'Dedicacion',
          cellClass: function (grid, row/*, col, rowRenderIndex, colRenderIndex*/) {
            if (row.entity.Estado === "Cancelada") {
              return 'resolucionCancelada';
            } else if (row.entity.Estado === "Expedida") {
              return 'resolucionExpedida';
            }
          },
          width: '7%',
          displayName: $translate.instant('DEDICACION')
        },
        {
          field: 'NumeroSemanas',
          cellClass: function (grid, row/*, col, rowRenderIndex, colRenderIndex*/) {
            if (row.entity.Estado === "Cancelada") {
              return 'resolucionCancelada';
            } else if (row.entity.Estado === "Expedida") {
              return 'resolucionExpedida';
            }
          },
          width: '10%',
          displayName: $translate.instant('SEMANAS')
        },
        {
          field: 'Estado',
          cellClass: function (grid, row/*, col, rowRenderIndex, colRenderIndex*/) {
            if (row.entity.Estado === "Cancelada") {
              return 'resolucionCancelada';
            } else if (row.entity.Estado === "Expedida") {
              return 'resolucionExpedida';
            }
          },
          width: '10%',
          displayName: $translate.instant('ESTADO')
        },
        {
          field: 'TipoResolucion',
          cellClass: function (grid, row/*, col, rowRenderIndex, colRenderIndex*/) {
            if (row.entity.Estado === "Cancelada") {
              return 'resolucionCancelada';
            } else if (row.entity.Estado === "Expedida") {
              return 'resolucionExpedida';
            }
          },
          width: '10%',
          displayName: $translate.instant('TIPO_RESOLUCION')
        },
        {
          name: $translate.instant('OPCIONES'),
          cellClass: function (grid, row/*, col, rowRenderIndex, colRenderIndex*/) {
            if (row.entity.Estado === "Cancelada") {
              return 'resolucionCancelada';
            } else if (row.entity.Estado === "Expedida") {
              return 'resolucionExpedida';
            }
          },
          enableFiltering: false, enableSorting: false,
          width: '11%',
          //Los botones son mostrados de acuerdo alestado de las resoluciones (ver,editar,configurar)
          cellTemplate: '<center>' +
            '<a class="ver" ng-click="grid.appScope.verVisualizarResolucion(row)">' +
            '<em title="{{\'VER_DOC_BTN\' | translate }}" class="fa fa-file-pdf-o fa-lg  faa-shake animated-hover"></em></a> ' +

            '<a ng-if="row.entity.TipoResolucion==\'Vinculación\' && row.entity.Estado==\'Solicitada\' " class="editar" ng-click="grid.appScope.verEditarDocentes(row)">' +
            '<em title="{{\'VINCULAR_BTN\' | translate }}" class="fa fa-user-plus fa-lg faa-shake animated-hover"></em></a> ' +

            '<a ng-if="row.entity.TipoResolucion==\'Cancelación\' && row.entity.Estado==\'Solicitada\'" class="editar" ng-click="grid.appScope.verEditarDocentes(row)">' +
            '<em title="{{\'CANCELAR_VIN_BTN\' | translate }}" class="fa fa-user-times fa-lg faa-shake animated-hover"></em></a> ' +
            '<a ng-if="row.entity.TipoResolucion==\'Cancelación\' && row.entity.Estado==\'Solicitada\'" class="editar" ng-click="grid.appScope.verListarDocentesCancelacion(row)">' +
            '<em title="{{\'CONSULTAR_CAN_BTN\' | translate }}" class="fa fa-table fa-lg faa-shake animated-hover"></em></a> ' +

            '<a ng-if="row.entity.TipoResolucion==\'Adición\' && row.entity.Estado==\'Solicitada\' "  class="editar" ng-click="grid.appScope.verEditarDocentes(row)">' +
            '<em title="{{\'ADICIONAR_BTN\' | translate }}" class="fa fa-plus-circle fa-lg  faa-shake animated-hover"></em></a> ' +
            '<a ng-if="row.entity.TipoResolucion==\'Adición\' && row.entity.Estado==\'Solicitada\' " class="editar" ng-click="grid.appScope.verListarDocentesAdicion(row)">' +
            '<em title="{{\'VER_DOCENTES_VIN_BTN\' | translate }}" class="fa fa-table fa-lg  faa-shake animated-hover"></em></a> ' +

            '<a ng-if="row.entity.TipoResolucion==\'Reducción\' && row.entity.Estado==\'Solicitada\' "  class="editar" ng-click="grid.appScope.verEditarDocentes(row)">' +
            '<em title="{{\'REDUCIR_BTN\' | translate }}" class="fa fa-minus-circle fa-lg  faa-shake animated-hover"></em></a> ' +
            '<a ng-if="row.entity.TipoResolucion==\'Reducción\'&& row.entity.Estado==\'Solicitada\' "  class="editar" ng-click="grid.appScope.verListarDocentesReduccion(row)">' +
            '<em title="{{\'VER_DOCENTES_VIN_BTN\' | translate }}" class="fa fa-table fa-lg  faa-shake animated-hover""></em></a> ' +

            '<a ng-if="row.entity.Estado==\'Solicitada\'" class="editar" ng-click="grid.appScope.verEditarResolucion(row)">' +
            '<em title="{{\'CONFIGURAR_DOC_BTN\' | translate }}" class="fa fa-pencil-square-o fa-lg faa-shake animated-hover"></em></a> ' +
            '<a ng-if="row.entity.Estado==\'Solicitada\'" class="ver" ng-click="grid.appScope.verRealizarAnulacion(row)">' +
            '<em title="{{\'ANULADA_BTN\' | translate }}" class="fa fa-times-circle fa-lg  faa-shake animated-hover"></em></a> ' +

            '</center>'

        }
      ],
      onRegisterApi: function (gridApi) {
        self.gridApi = gridApi;
        self.gridApi = gridApiService.pagination(self.gridApi, self.cargarDatosResolucion, $scope);
        self.gridApi = gridApiService.filter(self.gridApi, self.cargarDatosResolucion, $scope);
      }
    };

    //Funcion para cargar los datos de las resoluciones creadas y almacenadas dentro del sistema
    self.cargarDatosResolucion = function (offset, query) {
      var req = resolucionesMidRequest.get("gestion_resoluciones/get_resoluciones_inscritas", $.param({
        limit: self.resolucionesInscritas.paginationPageSize,
        offset: offset,
        query: typeof(query) === "string" ? query : query.join(",")
      }, true)); //Usar true para que $.param use query=...&query=.... etc
      req.then(gridApiService.paginationFunc(self.resolucionesInscritas, offset));
      return req;
    };

    //Se cargan los datos de las resoluciones de vinculación especial almacenadas
    self.cargarDatosResolucion($scope.offset, $scope.query).then(function (response) {

      self.resolucionesInscritas.data = response.data.Data;

      if (self.resolucionesInscritas.data !== null) {
        self.resolucionesInscritas.data.forEach(function (resol) {
          if (resolucion.FechaExpedicion !== null) {
            //dado que el servicio no está almacenando la Feha de expedición directamente como null, se toma el valor "0001-01-01T00:00:00Z" como tal
            if (resol.FechaExpedicion.toString() === "0001-01-01T00:00:00Z") {
              resol.FechaExpedicion = null;
              resol.EstadoTexto = "Creada";
            } else {
              if (resol.Estado) {
                resol.EstadoTexto = "Expedida";
              } else {
                resol.EstadoTexto = "Cancelada";
              }
            }
          } else {
            if (resol.Estado) {
              resol.EstadoTexto = "Expedida";
            } else {
              resol.EstadoTexto = "Cancelada";
            }
          }
        });
      }
    });

    self.registrarResolucion = function (row) {
      var resolucion2 = {
        Id: row.entity.Id,
        Numero: row.entity.Numero,
        NivelAcademico: row.entity.NivelAcademico,
        FacultadId: row.entity.Facultad,
        Vigencia: row.entity.Vigencia,
        Periodo: row.entity.Periodo,
        NumeroSemanas: row.entity.NumeroSemanas,
        Dedicacion: row.entity.Dedicacion,
        FacultadNombre: row.entity.FacultadNombre,
        FechaExpedicion: row.entity.FechaExpedicion,
        TipoResolucion: row.entity.TipoResolucion,
        IdDependenciaFirma: row.entity.IdDependenciaFirma,
        FacultadFirmaNombre: row.entity.FacultadFirmaNombre,
        Estado: row.entity.Estado,
        VigenciaCarga: row.entity.VigenciaCarga,
        PeriodoCarga: row.entity.PeriodoCarga
      };

      var local = JSON.stringify(resolucion2);
      localStorage.setItem('resolucion', local);
    };

    //Función para redireccionar la página web a la vista de edición del contenido de la resolución, donde se pasa por parámetro el id de la resolucion seleccionada
    $scope.verEditarResolucion = function (row) {
      self.registrarResolucion(row);
      $window.location.href = '#/vinculacionespecial/resolucion_detalle';

    };

    //Función para redireccionar la página web a la vista de adición y eliminación de docentes en la resolucion, donde se pasa por parámetro el id de la resolucion seleccionada
    $scope.verEditarDocentes = function (row) {
      if (row.entity.Dedicacion === "TCO-MTO") {
        row.entity.Dedicacion = "TCO|MTO";
      }

      self.registrarResolucion(row);

      if (row.entity.TipoResolucion === "Vinculación") {
        $window.location.href = '#/vinculacionespecial/hojas_de_vida_seleccion';
      }
      if (row.entity.TipoResolucion === "Cancelación") {
        $window.location.href = '#/vinculacionespecial/resolucion_cancelacion';
      }

      if (row.entity.TipoResolucion === "Adición") {
        $window.location.href = '#/vinculacionespecial/resolucion_adicion';
      }

      if (row.entity.TipoResolucion === "Reducción") {
        $window.location.href = '#/vinculacionespecial/resolucion_reduccion';
      }


    };

    $scope.verListarDocentesAdicion = function (row) {
      self.registrarResolucion(row);
      $window.location.href = '#/vinculacionespecial/resolucion_adicion_detalle';
    };

    $scope.verListarDocentesReduccion = function (row) {
      self.registrarResolucion(row);
      $window.location.href = '#/vinculacionespecial/resolucion_reduccion_detalle';
    };

    $scope.verListarDocentesCancelacion = function (row) {
      self.registrarResolucion(row);
      $window.location.href = '#/vinculacionespecial/resolucion_cancelacion_detalle';
    };
    //Función para asignar controlador de la vista resolucion_vista.html, donde se pasa por parámetro el id de la resolucion seleccionada con ayuda de $mdDialog
    $scope.verVisualizarResolucion = function (row) {

      self.registrarResolucion(row);

      $mdDialog.show({
        controller: "ResolucionVistaCtrl",
        controllerAs: 'resolucionVista',
        templateUrl: 'views/vinculacionespecial/resolucion_vista.html',
        parent: angular.element(document.body),
        clickOutsideToClose: true,
        fullscreen: true
      });
    };

    //Función para redireccionar la página web a la vista de creación de una nueva resolución
    self.generarNuevaResolucion = function () {
      $window.location.href = '#/vinculacionespecial/resolucion_generacion';
    };

    self.consultarDocentes = function () {
      $mdDialog.show({
        controller: "ResolucionBusquedaDocenteCtrl",
        controllerAs: 'resolucionBusquedaDocente',
        templateUrl: 'views/vinculacionespecial/resolucion_busqueda_docente.html',
        parent: angular.element(document.body),
        clickOutsideToClose: true,
        fullscreen: true
      });
    };

    //Función para realizar la anulación de la resolución
    $scope.verRealizarAnulacion = function (row) {
      resolucionRequest.get("resolucion/" + row.entity.Id).then(function (response) {
        var Resolucion = response.data.Data;
        var resolucion_estado = {
          FechaCreacion: self.CurrentDate,
          Usuario: "",
          EstadoResolucionId: {
            Id: 6,
          },
          ResolucionId: Resolucion
        };
        swal({
          title: 'Confirmar anulación',
          html: $translate.instant('CONFIRMAR_ANULADA') + '<br>' +
            $translate.instant('IRREVERSIBLE') + '<br>' +
            $translate.instant('NUMERO_RESOLUCION') + '<br>' +
            Resolucion.NumeroResolucion,
          type: 'question',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: $translate.instant('ANULADA_BTN'),
          allowOutsideClick: false
        }).then(function () {
          self.cambiarEstado(resolucion_estado);
        });
      });
    };

    //Función para cambiar el estado de la resolución
    self.cambiarEstado = function (resolucion_estado) {
      resolucionesMidRequest.get("gestion_previnculacion/docentes_previnculados", "id_resolucion=" + resolucion_estado.ResolucionId.Id.toString()).then(function (response) {
        if (response.data.Data.length === 0 || resolucion_estado.ResolucionId.TipoResolucionId.Id === 1) {
          resolucionRequest.post("resolucion_estado", resolucion_estado).then(function (response2) {
            if (response2.data.Success) {
              self.cargarDatosResolucion($scope.offset, $scope.query);
              swal(
                'Felicidades',
                $translate.instant('ANULADA'),
                'success'
              ).then(function () {
                $window.location.reload();
              });
            } else {
              swal(
                'Error',
                'Ocurrió un error',
                'error'
              );
            }
          });
        } else {
          resolucionesMidRequest.post("gestion_desvinculaciones/anular_modificaciones", response.data.Data).then(function (response2) {
            if (response2.data.Data === "OK") {
              resolucionRequest.post("resolucion_estado", resolucion_estado).then(function (response3) {
                if (response3.data.Success) {
                  self.cargarDatosResolucion($scope.offset, $scope.query);
                  swal(
                    'Felicidades',
                    $translate.instant('ANULADA'),
                    'success'
                  ).then(function () {
                    $window.location.reload();
                  });
                } else {
                  swal(
                    'Error',
                    'Ocurrió un error',
                    'error'
                  );
                }
              });
            } else {
              swal(
                'Error',
                'Ocurrió un error',
                'error'
              );
            }
          });
        }
      });
    };
  });
