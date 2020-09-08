import { Injectable } from '@angular/core';
import { Jwt } from "./modelos/jwt";
import { tap } from 'rxjs/operators';
import { Routes, RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {Registros11} from './modelos/Datos11'
import { Observable } from 'rxjs';
import { LogginService } from './log/loggin.service';

@Injectable({
  providedIn: 'root'
})
export class DatosService {
  private regi11:Registros11;
  //private Dominio ='http://192.168.1.25:3000';
  private Dominio ='http://localhost:3000';
  constructor(private http: HttpClient,private router:Router,private servicelog:LogginService) { }

  obtener(fecha:string,nombre:string)
  {
    var dat = {
      "name": nombre,
      "fecha": fecha
    };
    console.log(fecha)
    var headers={
      'vefificador':this.servicelog.gettk()
    }
    if(nombre=="Invernadero-11")
    return this.http.post(`${this.Dominio}/datos`,dat,{headers:headers  } )
    if(nombre=="Invernadero-12")
    return this.http.post(`${this.Dominio}/datos12`,dat,{headers:headers  } )

  }


  descarga(name,row,columns)
  {
    var dat = {
      "columnas": columns,
      "row": row,
    };
    var headers={
      'vefificador':this.servicelog.gettk()
    }
    var filename=name;
    return this.http.post(`${this.Dominio}/excel`,dat,{headers:headers,responseType: 'blob' as 'json'}).subscribe(
      (response: any) =>{
          let dataType = response.type;
          let binaryData = [];
          binaryData.push(response);
          let downloadLink = document.createElement('a');
          downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, {type: dataType}));
          if (filename) {
              downloadLink.setAttribute('download', filename);
          }
          document.body.appendChild(downloadLink);
          downloadLink.click();
      }
  );
  }

 chart(colum,f1,f2)
 {
   var body={
     "c":colum,
     "f1":f1,
     "f2":f2
   }
   var headers={
    'vefificador': this.servicelog.gettk()
  }
  return this.http.post(`${this.Dominio}/infocolum`,body,{headers:headers  } )


 }

 chart12(colum,f1,f2)
 {
   var body={
     "c":colum,
     "f1":f1,
     "f2":f2
   }
   var headers={
    'vefificador': this.servicelog.gettk()
  }
  return this.http.post(`${this.Dominio}/infocolum12`,body,{headers:headers  } )
 }

  invernaderos()
  {
    var headers={
      'vefificador': this.servicelog.gettk()
    }
    return this.http.get(`${this.Dominio}/invernaderos/${this.servicelog.getname()}`,{headers:headers  } )
  }

datostotales(fecha,inv)
{
  var ta="";
  if(inv=='Invernadero-11')
    ta="totales11"
  if(inv=='Invernadero-12')
    ta="totales12"
  var body={
    "tabla":ta,
    "fecha":fecha,
  };
  var headers={
    'vefificador': this.servicelog.gettk()
  }
  return this.http.post(`${this.Dominio}/tablatotales`,body,{headers:headers  } )
}


}



