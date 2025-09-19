export function useDateService() {

  const startFirstTrimester = new Date("09/10/2025 23:00") // Format mm/dd/yyyy hh:mm
  const endFirstTrimester = new Date("11/30/2025 23:00") // Format mm/dd/yyyy hh:mm
  const startSecondTrimester = new Date("11/17/2025 23:00") // Format mm/dd/yyyy hh:mm
  const endSecondTrimester = new Date("02/22/2025 23:00") // Format mm/dd/yyyy hh:mm
  const startThirdTrimester = new Date("02/16/2025 23:00") // Format mm/dd/yyyy hh:mm
  const endThirdTrimester = new Date("07/15/2025 23:00") // Format mm/dd/yyyy hh:mm

  const dateTrimester = (numTrimester : number) => {
    switch(numTrimester) {
      case 1 : return dateToString(startFirstTrimester) + " - " + dateToString(endFirstTrimester)
      case 2 : return dateToString(startSecondTrimester) + " - " + dateToString(endSecondTrimester)
      case 3 : return dateToString(startThirdTrimester) + " - " + dateToString(endThirdTrimester)
      default : return "Mauvais numéro de trimestre"
    }
  }

  const getTrimester = () => {
    const now = new Date();
    if (now < endFirstTrimester) return 1
    else if (now < endSecondTrimester) return 2
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
