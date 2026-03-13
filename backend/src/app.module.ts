import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MarcaModule } from './modules/marca/marca.module';
import { ModeloModule } from './modules/modelo/modelo.module';
import { SubmarcaModule } from './modules/submarca/submarca.module';
import { PropietarioModule } from './modules/propietario/propietario.module';
import { VehiculoModule } from './modules/vehiculo/vehiculo.module';
import { ServicioAceiteModule } from './modules/servicio-aceite/servicio-aceite.module';
import { VerificacionModule } from './modules/verificacion/verificacion.module';
import { TenenciaModule } from './modules/tenencia/tenencia.module';
import { ServicioLlantasModule } from './modules/servicio-llantas/servicio-llantas.module';
import { ServicioAmortiguadorModule } from './modules/servicio-amortiguador/servicio-amortiguador.module';
import { ServicioFrenoModule } from './modules/servicio-freno/servicio-freno.module';

@Module({
  imports: [MarcaModule, ModeloModule, SubmarcaModule, PropietarioModule, VehiculoModule, ServicioAceiteModule, VerificacionModule, TenenciaModule, ServicioLlantasModule, ServicioAmortiguadorModule, ServicioFrenoModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
