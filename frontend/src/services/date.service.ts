




export function useDateService() {

  
  const endFirstTrimester = new Date("12/12/2022 23:00") // Format mm/dd/yyyy hh:mm
  const endSecondTrimster = new Date("03/12/2023 23:00") // Format mm/dd/yyyy hh:mm

  const dateTrimester = (numTrimester : number) => {
    switch(numTrimester) {
      case 1 : return "Début de l'année - " + dateToString(endFirstTrimester)
      case 2 : return dateToString(endFirstTrimester) + " - " + dateToString(endSecondTrimster)
      case 3 : return dateToString(endSecondTrimster) + " - début de l'année prochaine"
      default : return "Mauvais numéro de trimestre"
    }
  }

  const getTrimester = () => {
    const now = new Date();
    if (now < endFirstTrimester) return 1
    else if (now < endSecondTrimster) return 2
    else return 3
  }

  const dateToString = (date : Date | null) => { // Date format : yyyy-mm-ddThh:mm:ss.sssZ, we want to display : dd/mm/yyyy
    return date == null ? "" : date.toLocaleDateString('fr-FR');
  }

  const stringToDate = (string : string | null) => { // Expected format : yyyy-mm-dd
    if (string === null) return null
    else {
        try {
            const [day, month, year] = string.split('/');
            const date = new Date(month + "/" + day + "/" + year + " 20:00"); // To be sure the right day is computed
            if (date.toString() === "Invalid Date") return null
            else return date
        } catch {
            return null
        }
    }
  }

  const tranformToDateIfPossible = (variable : any) => {
      try {
        return variable.toLocaleDateString('fr-FR')
      } catch {
        return variable
      }
  }

  return {
        dateTrimester : dateTrimester,
        getTrimester : getTrimester,
        dateToString : dateToString,
        stringToDate : stringToDate, 
        tranformToDateIfPossible : tranformToDateIfPossible
    }
}