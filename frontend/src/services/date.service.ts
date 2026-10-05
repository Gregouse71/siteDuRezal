export function useDateService() {
    // Année scolaire en cours, décidée en UTC comme le backend (wifi.py) : bascule au même instant.
    const getAnneeScolaire = () => {
        const now = new Date();
        return now.getUTCMonth() >= 8 ? now.getUTCFullYear() : now.getUTCFullYear() - 1;
    };

    // Bornes des trimestres : jours fixes, seule l'année défile
    const annee = getAnneeScolaire();
    const startFirstTrimester = new Date(annee, 8, 10); // 10 septembre
    const endFirstTrimester = new Date(annee, 10, 30); // 30 novembre
    const startSecondTrimester = new Date(annee, 10, 17); // 17 novembre
    const endSecondTrimester = new Date(annee + 1, 1, 22); // 22 février
    const startThirdTrimester = new Date(annee + 1, 1, 16); // 16 février
    const endThirdTrimester = new Date(annee + 1, 6, 15); // 15 juillet

    const dateTrimester = (numTrimester: number) => {
        switch (numTrimester) {
            case 1:
                return dateToString(startFirstTrimester) + " - " + dateToString(endFirstTrimester);
            case 2:
                return dateToString(startSecondTrimester) + " - " + dateToString(endSecondTrimester);
            case 3:
                return dateToString(startThirdTrimester) + " - " + dateToString(endThirdTrimester);
            default:
                return "Mauvais numéro de trimestre";
        }
    };

    const dateToString = (date: Date | null) => {
        // Date format : yyyy-mm-ddThh:mm:ss.sssZ, we want to display : dd/mm/yyyy
        return date == null ? "" : date.toLocaleDateString("fr-FR");
    };

    const stringToDate = (string: string | null) => {
        // Expected format : yyyy-mm-dd
        if (string === null) return null;
        else {
            try {
                const [day, month, year] = string.split("/");
                const date = new Date(month + "/" + day + "/" + year + " 20:00"); // To be sure the right day is computed
                if (date.toString() === "Invalid Date") return null;
                else return date;
            } catch {
                return null;
            }
        }
    };

    const tranformToDateIfPossible = (variable: any) => {
        try {
            return variable.toLocaleDateString("fr-FR");
        } catch {
            return variable;
        }
    };

    return {
        getAnneeScolaire: getAnneeScolaire,
        dateTrimester: dateTrimester,
        dateToString: dateToString,
        stringToDate: stringToDate,
        tranformToDateIfPossible: tranformToDateIfPossible,
    };
}
