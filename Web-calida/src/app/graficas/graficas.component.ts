import { Component, OnInit } from '@angular/core';
import { DatosService } from '../datos.service';
import {Chart} from 'chart.js'
import { Routes, RouterModule, Router } from '@angular/router';
import {NgbDate, NgbCalendar,NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import { Graficas } from '../modelos/graficas';
import { DatosGraficas } from '../modelos/graficas';


@Component({
  selector: 'app-graficas',
  templateUrl: './graficas.component.html',
  styleUrls: ['./graficas.component.css']
})
export class GraficasComponent implements OnInit {
  hoveredDate: NgbDate | null = null;
  datos_grafica:DatosGraficas[];
  fromDate: NgbDate | null;
  toDate: NgbDate | null;
  dias_graficas=[];
  aux:DatosGraficas;

  chart=[]
  constructor(private datos:DatosService,private router:Router,private calendar: NgbCalendar,public formatter: NgbDateParserFormatter) {
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 1);
  }
  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }

  }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) || this.isHovered(date);
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }

  ngOnInit(): void {

  }
  prueba()
  {

    var mes="";
    if(this.fromDate.month.toString().length>1)
    mes=this.fromDate.month.toString();
    else
    mes="0"+this.fromDate.month.toString()
    var f1=new Date(this.fromDate.year.toString()+"-"+mes+"-"+this.fromDate.day.toString());

    if(this.toDate.month.toString().length>1)
    mes=this.toDate.month.toString();
    else
    mes="0"+this.toDate.month.toString()
    var f2=new Date(this.toDate.year.toString()+"-"+mes+"-"+this.toDate.day.toString());

    var resta = f2.getTime() - f1.getTime()
    var dias=(Math.round(resta/ (1000*60*60*24)));


    var aux= this.fromDate;
    for (var i=0;i<=dias;i++)
    {
      if(aux.month.toString().length>1)
      mes=aux.month.toString();
      else
      mes="0"+aux.month.toString()

      this.dias_graficas.push(((aux.year.toString()+"-"+mes+"-"+aux.day.toString())));
      aux=this.calendar.getNext(aux,"d",1);

    }
    var dato="num_color3";
    this.datos.chart("num_color3",f1,f2);
    this.aux.campo=dato;
    this.datos.chart("num_color3",f1,f2).subscribe((res:Graficas)=>
    {

      //this.aux.datos=res;
    // this.datos_grafica=[(this.aux)]
    }
    );
    console.log(this.aux);
    console.log(this.dias_graficas);
  }

}
