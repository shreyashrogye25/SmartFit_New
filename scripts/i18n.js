/* ==========================================================================
   SMARTFIT - Internationalization (i18n) Service
   Multi-language support for English, Hindi, Spanish, French, and German
   ========================================================================== */

import { StorageService } from './storage.js';

export const TRANSLATIONS = {
  en: {
    langName: 'English',
    welcomeBack: 'Welcome Back',
    authSubtitle: 'Sign in to access your personal fitness metrics',
    continueGoogle: 'Continue with Google',
    orEmail: 'or continue with email',
    fullName: 'Full Name',
    emailAddress: 'Email Address',
    password: 'Password',
    rememberMe: 'Remember me',
    forgotPassword: 'Forgot password?',
    signIn: 'Sign In',
    createAccount: 'Create Account',
    noAccount: "Don't have an account?",
    haveAccount: 'Already have an account?',
    profileSetup: 'Profile Setup',
    profileSetupDesc: 'Select your language and personal details for calibrated health metrics.',
    selectLanguage: 'Preferred Language',
    gender: 'Gender',
    male: 'Male',
    female: 'Female',
    other: 'Other',
    age: 'Age',
    years: 'years',
    physicalMeasurements: 'Physical Measurements',
    physicalMeasurementsDesc: 'Used to calibrate Body Mass Index, daily burn, and metabolism.',
    height: 'Height',
    weight: 'Weight',
    targetWeight: 'Target Weight Goal',
    bodyFat: 'Body Fat Percentage',
    liveBmi: 'Live BMI Estimate',
    goalsActivity: 'Goals & Activity Level',
    goalsActivityDesc: 'Calibrate your daily burn, nutrition guidelines, and health cautions.',
    primaryObjective: 'Primary Objective',
    loseWeight: 'Lose Weight',
    buildMuscle: 'Build Muscle',
    stayFit: 'Stay Fit',
    boostStamina: 'Boost Stamina',
    howActive: 'How active are you?',
    activitySedentary: 'Sedentary',
    activitySedentaryDesc: 'Desk job, little to no regular exercise',
    activityLight: 'Lightly Active',
    activityLightDesc: 'Light workouts / walks 1-3 days/week',
    activityModerate: 'Moderately Active',
    activityModerateDesc: 'Moderate exercise / gym 3-5 days/week',
    activityVery: 'Very Active',
    activityVeryDesc: 'Hard training / sports 6-7 days/week',
    activityExtra: 'Extremely Active',
    activityExtraDesc: 'Physical labor or double workouts / athlete',
    preExistingDiseases: 'Pre-Existing Health Conditions / Diseases',
    diseasesDesc: 'Select any conditions you currently have for tailored clinical guidance:',
    diseaseNone: 'None (Healthy)',
    diseaseDiabetes: 'Diabetes (Type 1/2)',
    diseaseHypertension: 'Hypertension (High BP)',
    diseaseAsthma: 'Asthma / Respiratory',
    diseaseThyroid: 'Thyroid Disorder',
    diseaseHeart: 'Heart / Cardiovascular',
    diseaseArthritis: 'Arthritis / Joint Pain',
    diseaseCholesterol: 'High Cholesterol',
    openDashboard: 'Open SmartFit Dashboard →',
    navDashboard: 'Dashboard',
    navDiet: 'Diet Tracker',
    navWorkout: 'Workout',
    navWater: 'Water Intake',
    navProgress: 'Progress',
    navBmi: 'BMI Calculator',
    navAchievements: 'Achievements',
    navMeasurements: 'Measurements',
    navActivity: 'Activity Level',
    navDiseases: 'Health & Diseases',
    navLanguage: 'Language',
    navSettings: 'Settings',
    logout: 'Logout',
    greetingHey: 'Heyyy..',
    greetingSub: "Here's your fitness overview for today.",
    todaySuggestedPlan: "Today's Suggested Plan",
    suggestedPlanDesc: "Personalized daily targets calibrated from your physical profile and objective:",
    calsToConsume: 'Calories to Consume',
    calsToBurn: 'Calories to Burn',
    waterIntake: 'Water Intake',
    workoutSession: 'Workout Session',
    dailyPlanProgress: 'Daily Plan Progress',
    todaysPlanCompletion: "Today's Plan Completion",
    dailyPlanConsistency: 'Weekly Plan Adherence',
    todaysMissions: 'Daily Missions 🎯',
    saveProfile: 'Save & Update Profile',
    profileSaved: 'Health profile updated successfully! ✨'
  },
  hi: {
    langName: 'हिन्दी',
    welcomeBack: 'वापसी पर स्वागत है',
    authSubtitle: 'अपने व्यक्तिगत फिटनेस मेट्रिक्स तक पहुँचने के लिए साइन इन करें',
    continueGoogle: 'Google के साथ जारी रखें',
    orEmail: 'या ईमेल के साथ जारी रखें',
    fullName: 'पूरा नाम',
    emailAddress: 'ईमेल पता',
    password: 'पासवर्ड',
    rememberMe: 'मुझे याद रखें',
    forgotPassword: 'पासवर्ड भूल गए?',
    signIn: 'साइन इन करें',
    createAccount: 'खाता बनाएं',
    noAccount: 'क्या आपके पास खाता नहीं है?',
    haveAccount: 'पहले से एक खाता मौजूद है?',
    profileSetup: 'प्रोफ़ाइल सेटअप',
    profileSetupDesc: 'सटीक स्वास्थ्य सिफारिशों के लिए अपनी भाषा और विवरण चुनें।',
    selectLanguage: 'पसंदीदा भाषा',
    gender: 'लिंग',
    male: 'पुरुष',
    female: 'महिला',
    other: 'अन्य',
    age: 'आयु',
    years: 'वर्ष',
    physicalMeasurements: 'शारीरिक माप (स्लाइडर्स)',
    physicalMeasurementsDesc: 'आपके बॉडी मास इंडेक्स और दैनिक कैलोरी बर्न की गणना के लिए उपयोग किया जाता है।',
    height: 'ऊंचाई',
    weight: 'वजन',
    targetWeight: 'लक्ष्य वजन',
    bodyFat: 'शरीर का वसा प्रतिशत',
    liveBmi: 'लाइव बीएमआई अनुमान',
    goalsActivity: 'लक्ष्य और गतिविधि स्तर',
    goalsActivityDesc: 'पोषण और दैनिक बर्न को अपनी जीवनशैली के अनुसार अनुकूलित करें।',
    primaryObjective: 'प्राथमिक उद्देश्य',
    loseWeight: 'वजन घटाना',
    buildMuscle: 'मांसपेशियां बनाना',
    stayFit: 'स्वस्थ रहना',
    boostStamina: 'सहनशक्ति बढ़ाना',
    howActive: 'आप कितने सक्रिय हैं?',
    activitySedentary: 'गतिहीन (कम सक्रिय)',
    activitySedentaryDesc: 'डेस्क कार्य, बहुत कम या कोई व्यायाम नहीं',
    activityLight: 'हल्का सक्रिय',
    activityLightDesc: 'सप्ताह में 1-3 दिन हल्का व्यायाम या टहलना',
    activityModerate: 'मध्यम सक्रिय',
    activityModerateDesc: 'सप्ताह में 3-5 दिन मध्यम व्यायाम/जिम',
    activityVery: 'अत्यधिक सक्रिय',
    activityVeryDesc: 'सप्ताह में 6-7 दिन कठिन प्रशिक्षण',
    activityExtra: 'एथलीट / चरम सक्रिय',
    activityExtraDesc: 'शारीरिक श्रम या दिन में 2 बार प्रशिक्षण',
    preExistingDiseases: 'पहले से मौजूद स्वास्थ्य स्थितियां / बीमारियां',
    diseasesDesc: 'व्यक्तिगत नैदानिक मार्गदर्शन के लिए अपनी मौजूदा स्थितियां चुनें:',
    diseaseNone: 'कोई नहीं (पूरी तरह स्वस्थ)',
    diseaseDiabetes: 'मधुमेह (डायबिटीज)',
    diseaseHypertension: 'उच्च रक्तचाप (हाई बीपी)',
    diseaseAsthma: 'अस्थमा / श्वसन संबंधी',
    diseaseThyroid: 'थायराइड विकार',
    diseaseHeart: 'हृदय / कार्डियोवैस्कुलर',
    diseaseArthritis: 'गठिया / जोड़ों का दर्द',
    diseaseCholesterol: 'उच्च कोलेस्ट्रॉल',
    openDashboard: 'डैशबोर्ड खोलें →',
    navDashboard: 'डैशबोर्ड',
    navDiet: 'आहार ट्रैकर',
    navWorkout: 'कसरत',
    navWater: 'पानी की मात्रा',
    navProgress: 'प्रगति',
    navBmi: 'बीएमआई कैलकुलेटर',
    navAchievements: 'उपलब्धियां',
    navMeasurements: 'शरीर और स्वास्थ्य',
    navSettings: 'सेटिंग्स',
    logout: 'लॉग आउट',
    greetingHey: 'नमस्ते..',
    greetingSub: 'आज के लिए आपका फिटनेस अवलोकन यहाँ है।',
    todaySuggestedPlan: "आज की सुझाई गई योजना",
    suggestedPlanDesc: "आपकी प्रोफ़ाइल और लक्ष्य के अनुसार कैलिब्रेटेड दैनिक लक्ष्य:",
    calsToConsume: 'खपत के लिए कैलोरी',
    calsToBurn: 'बर्न करने के लिए कैलोरी',
    waterIntake: 'पानी की मात्रा',
    workoutSession: 'कसरत सत्र',
    dailyPlanProgress: 'दैनिक योजना प्रगति',
    todaysPlanCompletion: 'आज की योजना पूर्णता',
    dailyPlanConsistency: 'साप्ताहिक योजना निरंतरता',
    todaysMissions: 'दैनिक चुनौतियाँ 🎯',
    saveProfile: 'प्रोफ़ाइल सहेजें और अपडेट करें',
    profileSaved: 'स्वास्थ्य प्रोफ़ाइल सफलतापूर्वक अपडेट हो गई! ✨'
  },
  es: {
    langName: 'Español',
    welcomeBack: 'Bienvenido de nuevo',
    authSubtitle: 'Inicia sesión para ver tus métricas de salud',
    continueGoogle: 'Continuar con Google',
    orEmail: 'o continuar con correo electrónico',
    fullName: 'Nombre Completo',
    emailAddress: 'Correo Electrónico',
    password: 'Contraseña',
    rememberMe: 'Recordarme',
    forgotPassword: '¿Olvidaste tu contraseña?',
    signIn: 'Iniciar Sesión',
    createAccount: 'Crear Cuenta',
    noAccount: '¿No tienes una cuenta?',
    haveAccount: '¿Ya tienes una cuenta?',
    profileSetup: 'Configuración del Perfil',
    profileSetupDesc: 'Elige tu idioma y detalles personales para métricas precisas.',
    selectLanguage: 'Idioma Preferido',
    gender: 'Género',
    male: 'Masculino',
    female: 'Femenino',
    other: 'Otro',
    age: 'Edad',
    years: 'años',
    physicalMeasurements: 'Medidas Corporales',
    physicalMeasurementsDesc: 'Utilizado para calcular tu IMC y gasto metabólico diario.',
    height: 'Altura',
    weight: 'Peso',
    targetWeight: 'Meta de Peso',
    bodyFat: 'Porcentaje de Grasa',
    liveBmi: 'Estimación de IMC en Vivo',
    goalsActivity: 'Objetivos y Actividad',
    goalsActivityDesc: 'Adapta tu nutrición y calorías a tu nivel de entrenamiento.',
    primaryObjective: 'Objetivo Principal',
    loseWeight: 'Perder Peso',
    buildMuscle: 'Ganar Músculo',
    stayFit: 'Mantenerse en Forma',
    boostStamina: 'Mejorar Resistencia',
    howActive: '¿Qué tan activo eres?',
    activitySedentary: 'Sedentario',
    activitySedentaryDesc: 'Trabajo de oficina, poco o ningún ejercicio',
    activityLight: 'Ligeramente Activo',
    activityLightDesc: 'Ejercicio suave 1-3 días a la semana',
    activityModerate: 'Moderadamente Activo',
    activityModerateDesc: 'Ejercicio regular 3-5 días a la semana',
    activityVery: 'Muy Activo',
    activityVeryDesc: 'Entrenamiento intenso 6-7 días a la semana',
    activityExtra: 'Extremadamente Activo',
    activityExtraDesc: 'Trabajo físico pesado o atleta de competición',
    preExistingDiseases: 'Condiciones de Salud Preexistentes',
    diseasesDesc: 'Selecciona cualquier condición médica para recomendaciones personalizadas:',
    diseaseNone: 'Ninguna (Saludable)',
    diseaseDiabetes: 'Diabetes (Tipo 1/2)',
    diseaseHypertension: 'Hipertensión (Presión Alta)',
    diseaseAsthma: 'Asma / Respiratorio',
    diseaseThyroid: 'Trastorno Tiroideo',
    diseaseHeart: 'Cardiovascular / Corazón',
    diseaseArthritis: 'Artritis / Dolor Articular',
    diseaseCholesterol: 'Colesterol Alto',
    openDashboard: 'Abrir Panel SmartFit →',
    navDashboard: 'Panel',
    navDiet: 'Dieta',
    navWorkout: 'Entrenamiento',
    navWater: 'Agua',
    navProgress: 'Progreso',
    navBmi: 'Calculadora IMC',
    navAchievements: 'Logros',
    navMeasurements: 'Cuerpo y Salud',
    navSettings: 'Ajustes',
    logout: 'Cerrar Sesión',
    greetingHey: 'Holaaa..',
    greetingSub: 'Aquí está tu resumen de bienestar para hoy.',
    todaySuggestedPlan: "Plan Diario Sugerido",
    suggestedPlanDesc: "Objetivos diarios personalizados según tu perfil y meta:",
    calsToConsume: 'Calorías a Consumir',
    calsToBurn: 'Calorías a Quemar',
    waterIntake: 'Consumo de Agua',
    workoutSession: 'Sesión de Entrenamiento',
    dailyPlanProgress: 'Progreso del Plan Diario',
    todaysPlanCompletion: 'Cumplimiento del Plan Hoy',
    dailyPlanConsistency: 'Adherencia al Plan Semanal',
    todaysMissions: 'Misiones Diarias 🎯',
    saveProfile: 'Guardar Perfil',
    profileSaved: '¡Perfil de salud actualizado con éxito! ✨'
  },
  fr: {
    langName: 'Français',
    welcomeBack: 'Bon retour',
    authSubtitle: 'Connectez-vous pour voir vos métriques de fitness',
    continueGoogle: 'Continuer avec Google',
    orEmail: 'ou continuer avec email',
    fullName: 'Nom Complet',
    emailAddress: 'Adresse Email',
    password: 'Mot de passe',
    rememberMe: 'Se souvenir de moi',
    forgotPassword: 'Mot de passe oublié ?',
    signIn: 'Se Connecter',
    createAccount: 'Créer un Compte',
    noAccount: 'Vous n\'avez pas de compte ?',
    haveAccount: 'Vous avez déjà un compte ?',
    profileSetup: 'Configuration du Profil',
    profileSetupDesc: 'Sélectionnez votre langue et vos données personnelles.',
    selectLanguage: 'Langue Préférée',
    gender: 'Genre',
    male: 'Homme',
    female: 'Femme',
    other: 'Autre',
    age: 'Âge',
    years: 'ans',
    physicalMeasurements: 'Mesures Physiques',
    physicalMeasurementsDesc: 'Utilisé pour calculer votre IMC et votre métabolisme de base.',
    height: 'Taille',
    weight: 'Poids',
    targetWeight: 'Poids Cible',
    bodyFat: 'Graisse Corporelle',
    liveBmi: 'IMC en Direct',
    goalsActivity: 'Objectifs & Activité',
    goalsActivityDesc: 'Ajustez votre nutrition et vos calories quotidiennes.',
    primaryObjective: 'Objectif Principal',
    loseWeight: 'Perdre du Poids',
    buildMuscle: 'Prendre du Muscle',
    stayFit: 'Rester en Forme',
    boostStamina: 'Endurance',
    howActive: 'Quel est votre niveau d’activité ?',
    activitySedentary: 'Sédentaire',
    activitySedentaryDesc: 'Travail de bureau, peu ou pas d’exercice',
    activityLight: 'Légèrement Actif',
    activityLightDesc: 'Exercice léger 1 à 3 jours par semaine',
    activityModerate: 'Modérément Actif',
    activityModerateDesc: 'Entraînement 3 à 5 jours par semaine',
    activityVery: 'Très Actif',
    activityVeryDesc: 'Entraînement intensif 6 à 7 jours par semaine',
    activityExtra: 'Extrêmement Actif',
    activityExtraDesc: 'Travail très physique ou athlète',
    preExistingDiseases: 'Pathologies / Maladies Préexistantes',
    diseasesDesc: 'Sélectionnez vos antécédents médicaux pour des conseils adaptés :',
    diseaseNone: 'Aucune (En bonne santé)',
    diseaseDiabetes: 'Diabète (Type 1/2)',
    diseaseHypertension: 'Hypertension Artérielle',
    diseaseAsthma: 'Asthme / Respiratoire',
    diseaseThyroid: 'Trouble de la Thyroïde',
    diseaseHeart: 'Cardiovasculaire / Cœur',
    diseaseArthritis: 'Arthrite / Articulations',
    diseaseCholesterol: 'Cholestérol Élevé',
    openDashboard: 'Accéder au Tableau de Bord →',
    navDashboard: 'Tableau de bord',
    navDiet: 'Alimentation',
    navWorkout: 'Entraînement',
    navWater: 'Hydratation',
    navProgress: 'Progrès',
    navBmi: 'Calculateur IMC',
    navAchievements: 'Succès',
    navMeasurements: 'Corps & Santé',
    navSettings: 'Paramètres',
    logout: 'Déconnexion',
    greetingHey: 'Salut..',
    greetingSub: 'Voici votre aperçu santé pour aujourd’hui.',
    todaySuggestedPlan: "Plan Quotidien Suggéré",
    suggestedPlanDesc: "Objectifs quotidiens personnalisés selon votre profil et objectif :",
    calsToConsume: 'Calories à Consommer',
    calsToBurn: 'Calories à Brûler',
    waterIntake: "Apport en Eau",
    workoutSession: "Séance d'Entraînement",
    dailyPlanProgress: 'Progrès du Plan Quotidien',
    todaysPlanCompletion: "Achèvement du Plan du Jour",
    dailyPlanConsistency: "Régularité du Plan Semaine",
    todaysMissions: 'Missions du Jour 🎯',
    saveProfile: 'Enregistrer le Profil',
    profileSaved: 'Profil santé mis à jour avec succès ! ✨'
  },
  de: {
    langName: 'Deutsch',
    welcomeBack: 'Willkommen zurück',
    authSubtitle: 'Melden Sie sich an, um Ihre Fitnessmetriken zu sehen',
    continueGoogle: 'Mit Google fortfahren',
    orEmail: 'oder mit E-Mail fortfahren',
    fullName: 'Vollständiger Name',
    emailAddress: 'E-Mail-Adresse',
    password: 'Passwort',
    rememberMe: 'Angemeldet bleiben',
    forgotPassword: 'Passwort vergessen?',
    signIn: 'Anmelden',
    createAccount: 'Konto erstellen',
    noAccount: 'Noch kein Konto?',
    haveAccount: 'Bereits ein Konto?',
    profileSetup: 'Profil einrichten',
    profileSetupDesc: 'Wählen Sie Ihre Sprache und Angaben für genaue Metriken.',
    selectLanguage: 'Bevorzugte Sprache',
    gender: 'Geschlecht',
    male: 'Männlich',
    female: 'Weiblich',
    other: 'Divers',
    age: 'Alter',
    years: 'Jahre',
    physicalMeasurements: 'Körpermaße (Schieberegler)',
    physicalMeasurementsDesc: 'Wird zur Berechnung Ihres BMI und Ihres Kalorienbedarfs genutzt.',
    height: 'Größe',
    weight: 'Gewicht',
    targetWeight: 'Zielgewicht',
    bodyFat: 'Körperfettanteil',
    liveBmi: 'Live-BMI-Schätzung',
    goalsActivity: 'Ziele & Aktivitätsniveau',
    goalsActivityDesc: 'Passen Sie Ernährung und Energiebedarf an Ihren Lebensstil an.',
    primaryObjective: 'Hauptziel',
    loseWeight: 'Gewicht verlieren',
    buildMuscle: 'Muskeln aufbauen',
    stayFit: 'Fit bleiben',
    boostStamina: 'Ausdauer steigern',
    howActive: 'Wie aktiv sind Sie?',
    activitySedentary: 'Sitzend',
    activitySedentaryDesc: 'Bürojob, wenig bis keine Bewegung',
    activityLight: 'Leicht Aktiv',
    activityLightDesc: 'Leichtes Training 1-3 Tage pro Woche',
    activityModerate: 'Mäßig Aktiv',
    activityModerateDesc: 'Regelmäßiger Sport 3-5 Tage pro Woche',
    activityVery: 'Sehr Aktiv',
    activityVeryDesc: 'Hartes Training 6-7 Tage pro Woche',
    activityExtra: 'Extrem Aktiv',
    activityExtraDesc: 'Körperliche Schwerarbeit oder Leistungssportler',
    preExistingDiseases: 'Bestehende Erkrankungen & Vorerkrankungen',
    diseasesDesc: 'Wählen Sie etwaige Vorerkrankungen für medizinische Hinweise:',
    diseaseNone: 'Keine (Gesund)',
    diseaseDiabetes: 'Diabetes (Typ 1/2)',
    diseaseHypertension: 'Bluthochdruck (Hypertonie)',
    diseaseAsthma: 'Asthma / Atemwege',
    diseaseThyroid: 'Schilddrüsenerkrankung',
    diseaseHeart: 'Herz / Herz-Kreislauf',
    diseaseArthritis: 'Arthritis / Gelenkschmerzen',
    diseaseCholesterol: 'Hohes Cholesterin',
    openDashboard: 'Zum Dashboard →',
    navDashboard: 'Dashboard',
    navDiet: 'Ernährungstracker',
    navWorkout: 'Training',
    navWater: 'Wasserzufuhr',
    navProgress: 'Fortschritt',
    navBmi: 'BMI-Rechner',
    navAchievements: 'Erfolge',
    navMeasurements: 'Körper & Gesundheit',
    navSettings: 'Einstellungen',
    logout: 'Abmelden',
    greetingHey: 'Hallo..',
    greetingSub: 'Hier ist Ihre Fitnessübersicht für heute.',
    todaySuggestedPlan: "Vorgeschlagener Tagesplan",
    suggestedPlanDesc: "Personalisierte Tagesziele basierend auf Ihrem Profil und Ziel:",
    calsToConsume: 'Kalorienaufnahme',
    calsToBurn: 'Kalorienverbrauch',
    waterIntake: 'Wasserzufuhr',
    workoutSession: 'Trainingseinheit',
    dailyPlanProgress: 'Tagesplan-Fortschritt',
    todaysPlanCompletion: 'Tagesplan-Erfüllung',
    dailyPlanConsistency: 'Wöchentliche Plan-Treue',
    todaysMissions: 'Tagesmissionen 🎯',
    saveProfile: 'Profil speichern',
    profileSaved: 'Gesundheitsprofil erfolgreich aktualisiert! ✨'
  }
};

export class I18nService {
  static currentLang = 'en';

  static init() {
    const state = StorageService.getState();
    const savedLang = state.profile?.language || 'en';
    this.setLanguage(savedLang, false);
    this.bindLanguagePickers();

    window.addEventListener('smartfit:state-changed', (e) => {
      const lang = e.detail?.profile?.language || 'en';
      if (lang && lang !== this.currentLang) {
        this.setLanguage(lang, false);
      }
    });
  }

  static getLanguage() {
    return this.currentLang;
  }

  static t(key) {
    const dict = TRANSLATIONS[this.currentLang] || TRANSLATIONS.en;
    return dict[key] || TRANSLATIONS.en[key] || key;
  }

  static setLanguage(lang, persist = true) {
    if (!TRANSLATIONS[lang]) lang = 'en';
    this.currentLang = lang;

    if (persist) {
      StorageService.update(state => {
        state.profile.language = lang;
        return state;
      });
    }

    // Apply translations to all DOM elements marked with [data-i18n]
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const text = this.t(key);
      if (text) {
        if (el.tagName === 'INPUT' && el.getAttribute('placeholder')) {
          el.setAttribute('placeholder', text);
        } else {
          el.textContent = text;
        }
      }
    });

    // Update active state on any language pickers
    document.querySelectorAll('[data-lang-val]').forEach(btn => {
      if (btn.getAttribute('data-lang-val') === lang) {
        btn.classList.add('active', 'selected');
      } else {
        btn.classList.remove('active', 'selected');
      }
    });

    document.querySelectorAll('[data-meas-lang]').forEach(btn => {
      if (btn.getAttribute('data-meas-lang') === lang) {
        btn.classList.add('active', 'selected');
      } else {
        btn.classList.remove('active', 'selected');
      }
    });

    // Sync settings dropdown if present
    const settingsLang = document.getElementById('settings-language');
    if (settingsLang) settingsLang.value = lang;

    // Update active dropdown display if present
    const langDisplay = document.getElementById('header-lang-current');
    if (langDisplay) {
      langDisplay.textContent = lang.toUpperCase();
    }

    // Dispatch language changed event
    window.dispatchEvent(new CustomEvent('smartfit:lang-changed', { detail: { language: lang } }));
  }

  static bindLanguagePickers() {
    document.querySelectorAll('[data-lang-val]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const lang = btn.getAttribute('data-lang-val');
        this.setLanguage(lang, true);
      });
    });
  }
}
