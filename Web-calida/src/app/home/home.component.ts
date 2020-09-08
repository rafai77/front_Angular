
import { Routes, RouterModule, Router } from '@angular/router';
import { DatosService } from '../datos.service';
import { Registros11 } from '../modelos/Datos11';
import { Invernaderos } from '../modelos/Invernaderos';
import {Component, OnInit, ViewChild,AfterViewInit} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {FormControl, Validators} from '@angular/forms';
import { NgbDateStruct,NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import {MatPaginator} from '@angular/material/paginator';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  registros11:Registros11 [];
  dropvalue:string//valor actual del drop del invernadero
  data:Invernaderos;//almacenar los invernaderos
  displayedColumns: string[];
  displayedColumns2: string[];
  dataSource = new MatTableDataSource();
  dataSource2 = new MatTableDataSource();
  model: NgbDateStruct;

  constructor(private datos:DatosService,private router:Router,private calendar: NgbCalendar) {
    this.dataSource = new MatTableDataSource()
    this.dataSource2 = new MatTableDataSource()

   }

  graficas()
  {
    this.router.navigateByUrl('/Graficas');
  }
  inver():void
  {
    this.datos.invernaderos().subscribe((res:any )=>{
        this.data=res;
        this.dropvalue=res[0]['Nombre'];
       });
       console.log(this.data)
       this.dropvalue=this.data[0]['Nombre'];

  }
  Obtener():void
  {
    var fecha=this.model.year+"-0"+this.model.month+"-"+this.model.day;

    this.registros11=[];
    console.log(fecha);


    this.datos.obtener(fecha,this.dropvalue).subscribe((res:Registros11 [])=>
    {



      if(res.length>0)
      this.dataSource.data=res;
      var aux=[]
      for (var j in res[0])
        aux.push(j);
      this.displayedColumns=aux;


    });
    this.datos.datostotales(fecha,this.dropvalue).subscribe((res2:any)=>
    {
      var porc=[]
      var p=[];
      //this.dataSource2.data=[]
      this.dataSource2 = new MatTableDataSource()
      console.log(res2["datos"])

      this.dataSource2.data=res2["datos"]

      for (var i in res2["datos"][0] )
      {
        //console.log( res2["datos"][0][i])


        if(i=="i_total" || i=="fecha" ||i=="Total" )
        porc.push(  res2["datos"][0][i]);
        else
        porc.push( (res2["datos"][0][i]/ res2["datos"][0]["Total"]).toFixed(3) )

      }
      console.log(porc)


      var aux=[];
      for (var j in res2["datos"][0])
      aux.push(j);
       this.displayedColumns2=aux;
       console.log(this.displayedColumns2)
       p=[]
       for (let j=0; j<=porc.length;j++)
      {
        p[this.displayedColumns2[j]]=porc[j]
      }
      console.log(this.dataSource2.data.length);
      if(this.dataSource2.data.length<2)
        this.dataSource2.data.push(p)
      else
        this.dataSource2.data.pop()
      console.log(p)
      console.log(this.dataSource2.data)


    }

    );


    //this.dataSource.data=this.registros11;

  }

  changeAction(obj)
  {
    this.dropvalue=(obj);
    this.Obtener();


  }




  descargarExcel()
  {
    var fecha=this.model.year+"-0"+this.model.month+"-"+this.model.day;
    console.log(this.dataSource.data);
    this.datos.descarga("datos" +this.dropvalue+fecha ,this.dataSource.data,this.displayedColumns);
  }
  @ViewChild(MatSort, {static: true}, ) sort: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  ngOnInit()
  {

    this.model=this.calendar.getToday()
    this.inver();
    this.Obtener();
    console.log(this.data[0]['Nombre']);
    this.dataSource.paginator = this.paginator;
    this.dropvalue=this.data[0]['Nombre'];
    this.dataSource.sort = this.sort;
    this.dataSource.sort = this.sort;

    //this.dropvalue="Invernadero"



  }
  ngAfterViewInit()
  {

    this.Obtener();
    this.dataSource.sort = this.sort;
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;


  }
}
