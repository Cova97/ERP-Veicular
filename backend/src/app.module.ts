import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { MarcaModule } from './models/marca/marca.module';
import { ModeloModule } from './models/modelo/modelo.module';
import { SubmarcaModule } from './models/submarca/submarca.module';
import { PropietarioModule } from './models/propietario/propietario.module';
import { VehiculoModule } from './models/vehiculo/vehiculo.module';
import { ServicioAceiteModule } from './models/servicio-aceite/servicio-aceite.module';
import { VerificacionModule } from './models/verificacion/verificacion.module';
import { TenenciaModule } from './models/tenencia/tenencia.module';
import { ServicioLlantasModule } from './models/servicio-llantas/servicio-llantas.module';
import { ServicioAmortiguadorModule } from './models/servicio-amortiguador/servicio-amortiguador.module';
import { ServicioFrenoModule } from './models/servicio-freno/servicio-freno.module';

@Module({
  imports: [MarcaModule, ModeloModule, SubmarcaModule, PropietarioModule, VehiculoModule, ServicioAceiteModule, VerificacionModule, TenenciaModule, ServicioLlantasModule, ServicioAmortiguadorModule, ServicioFrenoModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
