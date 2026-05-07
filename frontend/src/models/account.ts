import isEqual from 'lodash/isEqual';
import { promotions, paymentTypes } from "../assets/lists";

export class Account {
    id : number;
    acces_wifi: boolean;
    is_admin: boolean;
    prenom : string | null;  
    nom : string | null;
    uid: string; // | null;
    password : string | null;
    email: string | null;
    email_verifie: boolean;
    credits: number;
    room: string | null;
    promotion: string;
    cotizT1: boolean;
    t1PaymentType: string;
    t1PaidAt: Date | null;
    cotizT2: boolean;
    t2PaymentType: string;
    t2PaidAt: Date | null;
    cotizT3: boolean;
    t3PaymentType: string;
    t3PaidAt: Date | null;
    createdAt: Date | null;
    message : string | null;

    constructor(data : any) {
      this.id = data.id;
      this.acces_wifi = data.acces_wifi !== undefined ? data.acces_wifi : false;
      this.is_admin = data.is_admin !== undefined ? data.is_admin : false;
      this.prenom = data.prenom || null;
      this.nom = data.nom || null;
      this.uid = data.uid ;//|| null;
      this.password = data.password || null;
      this.email = data.email || null;
      this.email_verifie = data.email_verifie !== undefined ? data.email_verifie : false;
      this.credits = data.credits || null;
      this.room = data.room || null;
      this.promotion = data.promotion !== undefined ? (promotions.includes(data.promotion) ? data.promotion : promotions[0]) : promotions[0];
      this.t1PaymentType = data.t1PaymentType !== undefined ? (paymentTypes.includes(data.t1PaymentType) ? data.t1PaymentType : paymentTypes[0]) : paymentTypes[0];
      this.cotizT1 = data.cotizT1 ? true : false;
      this.t1PaidAt = data.t1PaidAt ? new Date(data.t1PaidAt) : null;
      this.cotizT2 = data.cotizT2 ? true : false;
      this.t2PaymentType = data.t2PaymentType !== undefined ? (paymentTypes.includes(data.t2PaymentType) ? data.t2PaymentType : paymentTypes[0]) : paymentTypes[0];
      this.t2PaidAt = data.t2PaidAt ? new Date(data.t2PaidAt) : null;
      this.cotizT3 = data.cotizT3 ? true : false;
      this.t3PaymentType = data.t3PaymentType !== undefined ? (paymentTypes.includes(data.t3PaymentType) ? data.t3PaymentType : paymentTypes[0]) : paymentTypes[0];
      this.t3PaidAt = data.t3PaidAt ? new Date(data.t3PaidAt) : null;
      this.createdAt = data.createdAt ? new Date(data.createdAt) : null;
      this.message = data.message || null; // Format : First character is E (for Error) or S (for Success)
    }

    differenceWith(otherAccount : Account | undefined) {
      if (otherAccount === undefined) return {}
      else {
        var diff = {};
        Object.keys(this)
          .filter(key => key !== "message") // Don't want comparaison on the message field
          .forEach(
            key => {if (!isEqual((this as any)[key], (otherAccount as any)[key])) (diff as any)[key] = (this as any)[key]}
          )
        return diff
      }
    }

    get(parameter : string) : any {
      return this[parameter as keyof Account]
    }

    simpleChange(parameter: string, newVal : any) {
      (this as any)[parameter] = newVal
    }
 
    complexChange(parameter: string, newVal : any) {
      this.simpleChange(parameter, newVal);
      if (parameter[0] === "t") { // Change on a trimester
        const trimesterPrefix = parameter.slice(0,2);
        const trimesterSuffix = parameter.slice(2);
        const today = new Date((new Date()).toISOString().split('T')[0]);
        switch (trimesterSuffix) {
          case "Paid" : {
            this.simpleChange(trimesterPrefix + "PaidAt",  newVal ? today : null);
            this.simpleChange(trimesterPrefix + "PaymentType", paymentTypes[newVal ? 1 : 0]);
            break;
          }
          case "PaidAt" : {
            if (newVal === null) {
              this.simpleChange(trimesterPrefix + "Paid", false);
              this.simpleChange(trimesterPrefix + "PaymentType", paymentTypes[0]);
            } else {
              this.simpleChange(trimesterPrefix + "Paid", true);
              if (this.get(trimesterPrefix + "PaymentType") === paymentTypes[0]) this.simpleChange(trimesterPrefix + "PaymentType", paymentTypes[1])
            }
            break;
          }
          case "PaymentType" : {
            if (newVal === paymentTypes[0]) {
              this.simpleChange(trimesterPrefix + "Paid", false);
              this.simpleChange(trimesterPrefix + "PaidAt",  null);
            } else {
              this.simpleChange(trimesterPrefix + "Paid", true);
              this.simpleChange(trimesterPrefix + "PaidAt",  today);
            }
            break;
          }
        }
      }
    }


}


 