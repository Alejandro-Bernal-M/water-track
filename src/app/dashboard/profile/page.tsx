'use client'

import { useSession } from "next-auth/react"
import { useDispatch, useSelector } from "react-redux/es/exports";
import { getInvoices } from "@/redux/features/invoiceSlice";
import { getAlerts } from "@/redux/features/alertSlice";
import { useEffect, useState } from "react";
import {ThunkDispatch} from "@reduxjs/toolkit";
import { invoiceType } from "@/redux/features/invoiceSlice";
import { alertType } from "@/redux/features/alertSlice";
import InvoiceComponent from "@/components/InvoiceComponent";
import AlertComponent from "@/components/AlertComponent";
import AddInvoiceForm from "@/components/AddInvoiceForm";
import AddAlertForm from "@/components/AddAlertForm";
import styles from './profile.module.css';
import { IoIosWater } from  'react-icons/io';
import { ImFire } from  'react-icons/im'; 
import { SlEnergy } from 'react-icons/sl'

function Dashboard() {
  const { data: session } = useSession();
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  const invoices = useSelector((store: any) => store.invoice.invoices);
  const loadingInvoices = useSelector((store: any) => store.invoice.loading);
  const invoicesError = useSelector((store: any) => store.invoice.error);
  const alerts = useSelector((store:any) => store.alert.alerts)
  const loadingAlerts = useSelector((store:any) => store.alert.loading );
  const alertsError = useSelector((store: any) => store.alert.error);

  const [waterInvoices, setWaterInvoices] = useState<invoiceType[]>([]);
  const [gasInvoices, setGasInvoices] = useState<invoiceType[]>([]);
  const [electricityInvoices, setElectricityInvoices] = useState<invoiceType[]>([]);
  
  const [waterAlerts, setWaterAlerts] = useState<alertType[]>([]);
  const [gasAlerts, setGasAlerts] = useState<alertType[]>([]);
  const [electricityAlerts, setElectricityAlerts] = useState<alertType[]>([]);
  
  
  useEffect(() => {
    
    if(session?.user){
      const userId = (session?.user as { _id: string })._id;
      dispatch(getInvoices(userId));
      dispatch(getAlerts(userId));
    }
    
    
  }, [session, dispatch]);
  
  useEffect(() => {
    //function to order en descending order  (most recent first)
    function orderByDate(dateA:Date, dateB:Date){
      if (dateA > dateB) {
        return -1;
      }
      if (dateA < dateB) {
        return 1;
      }
      return 0;
    }

   if(!loadingInvoices){ const waterArray = invoices
    .filter((invoice: invoiceType) => invoice.service === 'water')
    .sort((a: invoiceType, b: invoiceType) => orderByDate(a.date, b.date));
    setWaterInvoices(waterArray);

    const gasArray = invoices
    .filter((invoice:invoiceType) => invoice.service == 'gas')
    .sort((a: invoiceType, b: invoiceType) => orderByDate(a.date, b.date));
    setGasInvoices(gasArray);

    const electricityArray = invoices
    .filter((invoice:invoiceType) => invoice.service == 'electricity')
    .sort((a: invoiceType, b: invoiceType) => orderByDate(a.date, b.date));
    setElectricityInvoices(electricityArray);
  }

  }, [invoices, loadingInvoices])


  useEffect(() => {
    if(!loadingAlerts){
      const waterArray = alerts
      .filter((alert:alertType) => alert.service == 'water');
      setWaterAlerts(waterArray);
      
      const gasArray = alerts
      .filter((alert:alertType) => alert.service == 'gas');
      setGasAlerts(gasArray);
      
      const electricityArray = alerts
      .filter((alert:alertType) => alert.service == 'electricity');
      setElectricityAlerts(electricityArray);
    }
  }, [alerts, loadingAlerts])


  return (
    <section className={styles.profile_section}>
      <h1 className={styles.title}>Bienvenido de nuevo : <span>{session?.user?.name}</span></h1>
      
      <AddInvoiceForm user={session?.user} />

      <AddAlertForm user={session?.user} />
      
      <div className={styles.register_holder}>
        <h2>Recibos de Agua <IoIosWater className={styles.icons} /> </h2>
        <h3>alertas</h3>
        { waterAlerts.length > 0 ? (waterAlerts.map((alert: alertType) => (
          <AlertComponent key={alert._id}
          service={alert.service}
          amount={alert.amount}
          _id={alert._id}
          />
          ))):  <p>Sin alerta para agua.</p>}
          {alertsError && <p>Error cargando las alertas.</p>}

        <h3>Recibos</h3>
        { waterInvoices.length > 0 ? (waterInvoices.map((invoice: invoiceType) => (
          <InvoiceComponent
          key={invoice._id}
          consumption={invoice.consumption}
            date={invoice.date}
            service={invoice.service}
            amount={invoice.amount} 
            _id ={invoice._id}
            alerts={waterAlerts}
          />
        ))) : <p>Sin Recibos.</p> }
        {invoicesError && <p>Error cargando los recibos.</p>}
      </div>

      <div className={styles.register_holder}>
        <h2>Recibos de Gas  < ImFire className={styles.icons} /></h2>
        <h3>alertas</h3>
        { gasAlerts.length > 0 ? (gasAlerts.map((alert: alertType) => (
          <AlertComponent key={alert._id}
          service={alert.service}
          amount={alert.amount}
          _id={alert._id}
          />
          ))):  <p>Sin alerta para gas.</p>}
        {alertsError && <p>Error cargando las alertas.</p>}

        <h3>Recibos</h3>
        { gasInvoices.length > 0 ? (gasInvoices.map((invoice: invoiceType) => (
          <InvoiceComponent
          key={invoice._id}
          consumption={invoice.consumption}
          date={invoice.date}
          service={invoice.service}
          amount={invoice.amount} 
          _id ={invoice._id}
          alerts={gasAlerts}
          />
          ))):  <p>Sin Recibos.</p> }
          {invoicesError && <p>Error cargando los recibos.</p>}
        </div>

      <div className={styles.register_holder}>
        <h2>Recibos de Energía <SlEnergy className={styles.icons} /></h2>
        <h3>alertas</h3>
        { electricityAlerts.length > 0 ? (electricityAlerts.map((alert: alertType) => (
        <AlertComponent key={alert._id}
          service={alert.service}
          amount={alert.amount}
          _id={alert._id}
          />
          ))):  <p>Sin alerta para energía.</p>}
        {alertsError && <p>Error cargando las alertas.</p>}

        <h3>Recibos</h3>
        {electricityInvoices.length > 0 ? (electricityInvoices.map((invoice: invoiceType) => (
          <InvoiceComponent
          key={invoice._id}
          consumption={invoice.consumption}
          date={invoice.date}
            service={invoice.service}
            amount={invoice.amount} 
            _id ={invoice._id}
            alerts={electricityAlerts}
          />
        ))): <p>Sin Recibos.</p>}
        {invoicesError && <p>Error cargando los recibos.</p>}
      </div>
    </section>
    )
}

export default Dashboard