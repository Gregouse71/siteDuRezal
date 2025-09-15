import { promotions, paymentTypes } from "../assets/lists";
import httpInstance from "./api";

export default function useAccountService() {


  const defaultValueOfAccountField = (fieldName: string) => {
    switch (fieldName) {
      case "id": return ""
      case "acces_wifi": return false
      case "admin": return false
      case "firstName": return ""
      case "lastName": return ""
      case "login": return ""
      case "password": return ""
      case "email": return ""
      case "email_verifie": return false
      case "credits": return ""
      case "room": return ""
      case "promotion": return promotions[0]
      case "cotizT1": return false
      case "t1PaymentType": return paymentTypes[0]
      case "t1PaidAt": return ""
      case "cotizT2": return false
      case "t2PaymentType": return paymentTypes[0]
      case "t2PaidAt": return ""
      case "cotizT3": return false
      case "t3PaymentType": return paymentTypes[0]
      case "t3PaidAt": return ""
      case "createdAt": return null
      default: return undefined
    }
  }

  const pwdChars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const pwdLen = 20;

  const createPassword = () => {
    return Array(pwdLen).fill(pwdChars).map(function (x) { return x[Math.floor(Math.random() * x.length)] }).join('')
  }

  const register = (registrationInfos: any) => {
    return new Promise<void>((resolve, reject) => {
      httpInstance.post("users", registrationInfos)
        .then(() => resolve())
        .catch(error => reject(error))
    })
  }

  const emailVerification = (verificationInfos: any) => {
    return new Promise<void>((resolve, reject) => {
      httpInstance.post(`auth/verify_email/${verificationInfos.uid}/${verificationInfos.token}`)
        .then(() => resolve())
        .catch(error => reject(error))
    })
  }

  const getNewPasswordMail = (verificationInfos: any) => {
    return new Promise<void>((resolve, reject) => {
      httpInstance.get(`auth/new_password_mail/${verificationInfos.email}`)
        .then(() => resolve())
        .catch(error => reject(error))
    })
  }

  const getNewPassword = (infos: any) => {
    return new Promise<void>((resolve, reject) => {
      httpInstance.get(`auth/new_password/${infos.token}`)
        .then((data: any) => resolve(data))
        .catch(error => reject(error))
    })
  }

  return {
    defaultValueOfAccountField: defaultValueOfAccountField,
    createPassword: createPassword,
    register: register,
    emailVerification: emailVerification,
    getNewPassword: getNewPassword,
  }
}

