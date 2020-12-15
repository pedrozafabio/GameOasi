export const SHOWS_TAG     = [0,0,0,0].map((_,index) => "Show"+(index+1));
export const WORKSHOPS_TAG = [0,0,0,0].map((_,index) => "Workshop"+(index+1));
export const GALERIAS_TAG  = [0].map((_,index) => "Galeria"+(index+1));
export const CABINE_FOTOS_TAG  = "Cabine";
export const FEIRA_TAG  = "Feira";

export const EnviromentsNames = {
    [SHOWS_TAG[0]]         :  'cliquePalco1',
    [SHOWS_TAG[1]]         :  'cliquePalco2',
    [SHOWS_TAG[2]]         :  'cliquePalco3',
    [SHOWS_TAG[3]]         :  'cliquePalco4',
    [WORKSHOPS_TAG[0]]     :  'cliqueWorkshop1',
    [WORKSHOPS_TAG[1]]     :  'cliqueWorkshop2',
    [WORKSHOPS_TAG[2]]     :  'cliqueWorkshop3',
    [WORKSHOPS_TAG[3]]     :  'cliqueWorkshop4',
    [GALERIAS_TAG[0]]      :  'cliqueGaleria1',
    [CABINE_FOTOS_TAG]  :  'cliqueCabine',
    [FEIRA_TAG]  :  'cliqueFeira',
};