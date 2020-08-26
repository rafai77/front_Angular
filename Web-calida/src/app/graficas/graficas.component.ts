import { Component, OnInit  } from '@angular/core';
import { DatosService } from '../datos.service';
import {Chart} from 'chart.js'
import { Routes, RouterModule, Router } from '@angular/router';
import {NgbDate, NgbCalendar,NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import { Graficas } from '../modelos/graficas';
import { Invernaderos } from '../modelos/Invernaderos';

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
  public chart:Chart
  public chart2:Chart

  color="";
  daños=["pudricion","tallo","flojo","mecanico","blossom","reventado","cierre","deforme","cicatriz","insecto","color_disparejo","caliz","viruz"]
  //daños=["pudricion","tallo","flojo","mecanico","blossom","reventado","cierre","deforme","cicatriz","insecto","color_disparejo","caliz","viruz"]
  dropvalue:string//valor actual del drop del invernadero
  data:Invernaderos;//almacenar los invernaderos


  constructor(private datos:DatosService,private router:Router,private calendar: NgbCalendar,public formatter: NgbDateParserFormatter) {
    this.fromDate = calendar.getPrev(calendar.getToday(), 'd', 8);
    this.toDate = calendar.getToday();
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

  inver():void
  {
    this.datos.invernaderos().subscribe((res:any )=>{
        this.data=res;
        this.dropvalue=res[0]['Nombre'];
       });
       //console.log(this.data)
       this.dropvalue=this.data[0]['Nombre'];

  }
  changeAction(obj)
  {

    this.dropvalue=(obj);
    this.graficar();
    console.log(this.dropvalue)


  }

  ngOnInit(): void {

    this.graficar();
    this.inver();
    //this.dropvalue=this.data[0]['Nombre']
  }

  grafica()//colores y brix para invernedero 12
  {
    //this.chart.destroy();


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

    //console.log(f1,f2)
    var dia="";
    var aux= this.fromDate;
    for (var i=0;i<=dias;i++)
    {
      if(aux.day.toString().length>1)
      dia=aux.day.toString();
      else
      dia="0"+aux.day.toString()
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
    var dato5="Brix2";
    var dat=[]
    dat.push(dato);
    dat.push(dato2);
    dat.push(dato3);
    dat.push(dato4);
    dat.push(dato5);
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
      //console.log(res)

      for (var i in dat)
      {
       for (var j in res)
       {

         if(dat[i]==res[j]["campo"])
         {
          if(this.dias_graficas.includes(res[j]["fecha"]))
          {
            aux2[this.dias_graficas.indexOf(res[j]["fecha"])]=(res[j]["valor"])
          //console.log(res[j])

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
      //console.log(this.dias_graficas)
      console.log(data_chart)
      console.log(this.chart)
      if (this.chart)
      {
        console.log(this.chart)
        this.chart.destroy();

      }

      this.chart=new Chart('canvas',{
        type:'line',
        data:{

          labels:this.dias_graficas,//.map(item => new Intl.DateTimeFormat('es-MX',{month:'long',day:'numeric'}).format(new Date(item))),
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

      }).update();
    }
    );

  }
  graficaD()// daños para el invernadero 11
  {
    //this.chart2.destroy();


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
    var dia="";
    for (var i=0;i<=dias;i++)
    {
      if(aux.day.toString().length>1)
      dia=aux.day.toString();
      else
      dia="0"+aux.day.toString()
      if(aux.month.toString().length>1)
      mes=aux.month.toString();
      else
      mes="0"+aux.month.toString()

      this.dias_graficas.push(((aux.year.toString()+"-"+mes+"-"+aux.day.toString())));
      aux=this.calendar.getNext(aux,"d",1);

    }
    var diasvalor=[]
    var aux2=[]
    var contador=0;
    var data_chart=[]
    var dataset=[]
    this.datos.chart(this.daños,f1,f2).subscribe((res:Graficas)=>
    {


      for(var i in this.dias_graficas)
      {
        diasvalor[i]=0;
      }

      aux2=diasvalor.slice();

      for (var i in this.daños)
      {
       for (var j in res)
       {

         if(this.daños[i]==res[j]["campo"])
         {
          if(this.dias_graficas.includes(res[j]["fecha"]))
          {
            aux2[this.dias_graficas.indexOf(res[j]["fecha"])]=(res[j]["valor"])

          }

         }
       }
       this.getRandomColor()
       data_chart.push(
         {
          label:this.daños[i],
          data:aux2,
          borderColor:this.color,
         })
       aux2=diasvalor.slice();

      }
     // console.log(this.dias_graficas)
     Chart.helpers.each(Chart.instances, function (instance) {
      instance.destroy();
    });
      if (this.chart2) this.chart2.destroy();
      this.chart2=new Chart('canvas2',{
        type:'line',
        data:{

          labels:this.dias_graficas,//.map(item => new Intl.DateTimeFormat('es-MX',{month:'long',day:'numeric'}).format(new Date(item))),
          datasets:data_chart
        },
        options:
        {
          title:{
            display:true,
            text:"Daños del invernadero 11",
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

      })
    }
    );
  }


  grafica12()// color y brix del invernadero 12
  {
    //this.chart.destroy();


    this.dias_graficas=[];
    var mes="";
    if(this.fromDate.month.toString().length>1)
    mes=this.fromDate.month.toString();
    else
    mes="0"+this.fromDate.month.toString()
    var f1=new Date(this.fromDate.year.toString()+"-"+mes+"-"+this.fromDate.day.toString());
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
    //console.log(f1,f2);
    var resta = f2.getTime() - f1.getTime()
    var dias=(Math.round(resta/ (1000*60*60*24)));

    var dia=""
    var aux= this.fromDate;
    for (var i=0;i<=dias;i++)
    {
      if(aux.day.toString().length>1)
      dia=aux.day.toString();
      else
      dia="0"+aux.day.toString()

      if(aux.month.toString().length>1)
      mes=aux.month.toString();
      else
      mes="0"+aux.month.toString()
      //console.log(aux.year.toString()+"-"+mes+"-"+dia)
      this.dias_graficas.push(((aux.year.toString()+"-"+mes+"-"+dia)));
      aux=this.calendar.getNext(aux,"d",1);

    }
    var dato="num_color3";
    var dato2="num_color4";
    var dato3="num_color5";
    var dato4="Brix1";
    var dato5="Brix2";
    var dato6="Brix3";
    var dato7="Brix4";
    var dat=[]
    dat.push(dato);
    dat.push(dato2);
    dat.push(dato3);
    dat.push(dato4);
    dat.push(dato5);
    dat.push(dato6);
    dat.push(dato7);
    var diasvalor=[]
    var aux2=[]
    var contador=0;
    var data_chart=[]
    var dataset=[]

    this.datos.chart12(dat,f1,f2).subscribe((res:Graficas)=>
    {



      for(var i in this.dias_graficas)
      {
        diasvalor[i]=0;
      }

      aux2=diasvalor.slice();
      //console.log(res)

      for (var i in dat)
      {
       for (var j in res)
       {

         if(dat[i]==res[j]["campo"])
         {
          // console.log(res[j]["fecha"]);
           //console.log(this.dias_graficas);
          if(this.dias_graficas.includes(res[j]["fecha"]))
          {
            aux2[this.dias_graficas.indexOf(res[j]["fecha"])]=(res[j]["valor"])
          //console.log(res[j])

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
      //console.log(this.dias_graficas)
      if (this.chart) this.chart.destroy();
      this.chart=new Chart('canvas',{
        type:'line',
        data:{

          labels:this.dias_graficas,//.map(item => new Intl.DateTimeFormat('es-MX',{month:'long',day:'numeric'}).format(new Date(item))),
          datasets:data_chart
        },
        options:
        {
          title:{
            display:true,
            text:"Colores del invernadero 12",
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

      }).update();
    }
    );

  }

  graficaD12()
  {
    Chart.helpers.each(Chart.instances, function (instance) {
      instance.destroy();
    });
//this.chart2.destroy();

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
    var dia="";
    for (var i=0;i<=dias;i++)
    {
      if(aux.day.toString().length>1)
      dia=aux.day.toString();
      else
      dia="0"+aux.day.toString()
      if(aux.month.toString().length>1)
      mes=aux.month.toString();
      else
      mes="0"+aux.month.toString()

      this.dias_graficas.push(((aux.year.toString()+"-"+mes+"-"+dia)));
      aux=this.calendar.getNext(aux,"d",1);

    }
    var diasvalor=[]
    var aux2=[]
    var contador=0;
    var data_chart=[]
    var dataset=[]
    this.datos.chart12(this.daños,f1,f2).subscribe((res:Graficas)=>
    {


      for(var i in this.dias_graficas)
      {
        diasvalor[i]=0;
      }

      aux2=diasvalor.slice();
      //console.log(res)

      for (var i in this.daños)
      {
       for (var j in res)
       {

         if(this.daños[i]==res[j]["campo"])
         {
          if(this.dias_graficas.includes(res[j]["fecha"]))
          {
            aux2[this.dias_graficas.indexOf(res[j]["fecha"])]=(res[j]["valor"])
          //console.log(res[j])

          }

         }
       }
       this.getRandomColor()
       data_chart.push(
         {
          label:this.daños[i],
          data:aux2,
          borderColor:this.color,
         })
       aux2=diasvalor.slice();

      }
      //console.log(this.dias_graficas)
      if (this.chart2) this.chart2.destroy();
      this.chart2=new Chart('canvas2',{
        type:'line',
        data:{

          labels:this.dias_graficas,//.map(item => new Intl.DateTimeFormat('es-MX',{month:'long',day:'numeric'}).format(new Date(item))),
          datasets:data_chart
        },
        options:
        {
          title:{
            display:true,
            text:"Daños del invernadero 12",
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

      }).update();
    }
    );

  }
graficar()
{
  Chart.helpers.each(Chart.instances, function (instance) {
    instance.destroy();
  });
  //console.log(this.dropvalue)
  if (this.dropvalue=='Invernadero-11')
  {
    this.grafica()
    this.graficaD()
  }
if (this.dropvalue=='Invernadero-12')
  {
    //console.log("12")
    this.grafica12()
    this.graficaD12()
    }
}

getRandomColor() {
  var letters = '0123456789ABCDEF';
      this.color = "#";
      for (var i = 0; i < 6; i++) {

        this.color += letters[Math.floor(Math.random() * 16)];
      }

    }

}
