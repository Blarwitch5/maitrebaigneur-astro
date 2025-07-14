// Configuration des endpoints FormCarry
export const FORMCARRY_ENDPOINTS = {
  CONTACT: import.meta.env.PUBLIC_FORMCARRY_CONTACTFORM_ENDPOINT,
  AQUAVERSAIRE: import.meta.env.PUBLIC_FORMCARRY_AQUAVERSAIREFORM_ENDPOINT,
  EVENT: import.meta.env.PUBLIC_FORMCARRY_EVENTFORM_ENDPOINT,
  SWIMMING: import.meta.env.PUBLIC_FORMCARRY_SWIMMINGFORM_ENDPOINT,
} as const;

// Vérification des endpoints
export const validateEndpoints = () => {
  const missingEndpoints = Object.entries(FORMCARRY_ENDPOINTS)
    .filter(([_, endpoint]) => !endpoint)
    .map(([name]) => name);

  if (missingEndpoints.length > 0) {
    console.error('Endpoints FormCarry manquants:', missingEndpoints);
    return false;
  }

  return true;
};

// Fonction utilitaire pour envoyer un formulaire
export const submitForm = async (endpoint: string, data: any) => {
  try {
    console.log('Envoi vers:', endpoint);
    console.log('Données:', data);

    const response = await fetch(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    console.log('Statut:', response.status);
    console.log('Headers:', Object.fromEntries(response.headers.entries()));

    if (response.ok) {
      const responseData = await response.text();
      console.log('Réponse réussie:', responseData);
      return { success: true, data: responseData };
    } else {
      const errorData = await response.text();
      console.error('Erreur HTTP:', response.status, errorData);
      return { success: false, error: `HTTP ${response.status}: ${errorData}` };
    }
  } catch (error) {
    console.error('Erreur réseau:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Erreur inconnue' };
  }
};
