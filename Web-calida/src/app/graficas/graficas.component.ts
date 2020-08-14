import { Component, OnInit } from '@angular/core';
import { DatosService } from '../datos.service';
import {Chart} from 'chart.js'
import { Routes, RouterModule, Router } from '@angular/router';
import {NgbDate, NgbCalendar,NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import { Graficas } from '../modelos/graficas';

@Component({
  selector: 'app-graficas',
  templateUrl: './graficas.component.html',
  styleUrls: ['./graficas.component.css']
})
export class GraficasComponent implements OnInit {
  hoveredDate: NgbDate | null = null;
  datos_grafica:Graficas[];
  fromDate: NgbDate | null;
  toDate: NgbDate | null;
  dias_graficas=[];
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
    this.dias_graficas=[];
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
    var dato2="num_color4";
    var dato3="num_color5";
    var dato4="Brix";
    var dat=[]
    dat.push(dato);
    dat.push(dato2);
    dat.push(dato3);
    dat.push(dato4);

    this.datos.chart("num_color3",f1,f2);
    var diasvalor=[]
    var aux2=[]
    var contador=0;
    var data_chart=[]
    var dataset=[]
    this.datos.chart(dat,f1,f2).subscribe((res:Graficas)=>
    {


      for(var i in this.dias_graficas)
      {
        diasvalor[i]=0;
      }

      aux2=diasvalor.slice();
      console.log(res)

      for (var i in dat)
      {
       for (var j in res)
       {

         if(dat[i]==res[j]["campo"])
         {
          if(this.dias_graficas.includes(res[j]["fecha"]))
          {
            aux2[this.dias_graficas.indexOf(res[j]["fecha"])]=(res[j]["valor"])
          console.log(res[j])

          }

         }
       }
       this.getRandomColor()
       data_chart.push(
         {
          label:dat[i],
          data:aux2,
          borderColor:this.color,
         })
       aux2=diasvalor.slice();

      }
      console.log(data_chart)

      this.chart=new Chart('canvas',{
        type:'line',
        data:{

          labels:this.dias_graficas,
          datasets:data_chart
        },
        options:
        {
          title:{
            display:true,
            text:"Colores del invernadero 11",
            fontSize:30,


          },
          legend:{
            position:'bottom',
            labels:
            {
              padding:20,
              fontFamily:'system-ui',
              fontColor:'black'
            }

          },
          tooltips:
          {
            backgroundColor:'#05b4f6',
            mode:'x'
          },
          elements:
          {
            line:{
              borderWidth:4,
              fill:false
            },
            point:{
              radius:6,
              borderWidth:4,
              backgroundColor:'white',
              hoverRadius:8
            }
          }
        }

      });
    }
    );


  }
  letters = '0123456789ABCDEF';
color = '#';

getRandomColor() {
      this.color = "#";
      for (var i = 0; i < 6; i++) {

        this.color += this.letters[Math.floor(Math.random() * 16)];
      }

    }

}
