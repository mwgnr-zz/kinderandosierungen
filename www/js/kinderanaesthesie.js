/*
 * Copyright 2016 Michael Wagner
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *    http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var phasen = {
    "Prämedikation": {
        "Ibuprofen": {
            c: [40, "mg/ml"],
            minDosis: [10, "mg"],
        },
        "Midazolam": {
            c: [2, "mg/ml"],
            minDosis: [0.4, "mg"],
            stoppDosis: 8,
        },
        "Midazolam nasal": {
            c: [5, "mg/ml"],
            minDosis: [0.2, "mg"],
        },
    },
    "Einleitung": {
        "Propofol": {
            c: [10, "mg/ml"],
            minDosis: [2, "mg"],
            maxDosis: [4, "mg"],
        },
        "Remifentanil": {
            c: [20, "µg/ml"],
            minDosis: [30, "µg/h"],
        },
        "Rocuronium": {
            c: [10, "mg/ml"],
            minDosis: [0.6, "mg"],
        },
        "Succinylcholin": {
            c: [20, "mg/ml"],
            minDosis: [1.5, "mg/ml"],
            maxDosis: [2, "mg"],
        },
        "Sufentanil": {
            c: [5, "µg/ml"],
            minDosis: [0.5, "µg"],
            maxDosis: [1, "µg"],
        },
    },
    "Aufrechterhaltung": {
        "Flüssigkeitsbedarf": {
            minDosis: [null, "ml/h"],
        },
        "Propofol-P": {
            c: [10, "mg/ml"],
            minDosis: [5, "mg/h"],
            maxDosis: [10, "mg/h"],
        },
        "Remifentanil-P": {
            c: [20, "µg/ml"],
            minDosis: [12, "µg/h"],
            maxDosis: [18, "µg/h"],
        },
    },
    "Antagonisierung": {
        "Flumazenil": {
            c: [0.1, "mg/ml"],
            minDosis: [0.01, "mg"],
        },
        "Naloxon": {
            c: [0.04, "mg/ml"],
            minDosis: [0.01, "mg"],
        },
        "Neostigmin" : {
            c: [0.5, "mg/ml"],
            minDosis: [0.05, "mg"],
        },
    },
    "Schmerztherapie": {
        "Metamizol": {
            c: [500, "mg/ml"],
            minDosis: [10, "mg"],
            maxDosis: [20, "mg"],
        },
        "Paracetamol": {
            c: [10, "mg/ml"],
            minDosis: [15, "mg"],
        },
        "Piritramid": {
            c: [1, "mg/ml"],
            minDosis: [0.05, "mg"],
            maxDosis: [0.1, "mg"],
        },
    },
    "PONV" : {
        "Dexamethason": {
            c: [1, "mg/ml"],
            minDosis: [0.15, "mg"],
            stoppDosis: 4,
        },
        "Ondansetron": {
            c: [1, "mg/ml"],
            minDosis: [0.1, "mg"],
            stoppDosis: 4,
        },
    },
    "Aufwachraum-Delir": {
        "Clonidin": {
            c: [15, "µg/ml"],
            minDosis: [0.5, "µg"],
            maxDosis: [1, "µg"],
        },
        "Esketamin": {
            c: [5, "mg/ml"],
            minDosis: [0.5, "mg"],
            maxDosis: [1, "mg"],
        },
        "Propofol": {
            c: [10, "mg/ml"],
            minDosis: [0.5, "mg"],
            maxDosis: [1, "mg"],
        },
    },
    "Notfall": {
        "Adrenalin": {
            c: [0.1, "mg/ml"],
            minDosis: [0.01, "mg"],
        },
        "Amiodaron": {
            c: [50, "mg/ml"],
            minDosis: [5, "mg"],
        },
        "Atropin": {
            c: [0.1, "mg/ml"],
            minDosis: [0.01, "mg"],
        },
        "Noradrenalin": {
            c: [10, "µq/ml"],
            minDosis: [0.1, "µg"],
        },
        "Prednisolon": {
            // Becke, Allergie und Anaphylaxie im Kindesalter, 2013 (1-2mg/kg)
            // Eich, Maße & Dosierungen Kinderanästhesie, 2013 (4mg/kg)
            c: [50, "mg/ml"],
            minDosis: [2, "mg"],
            maxDosis: [4, "mg"],
        },
        "Salbutamol p.i.": {
            c: [0.5, "mg/ml"],
            minDosis: [0.25, "mg"],
            stoppDosis: 2,
        },
    },
};

function rmZeros(number) {
    return Number(number.toFixed(1));
}

$(document).ready(function(){
    $("#flipGewicht").on("change", function() {
        $("#formGewicht").empty();
        if ($("#flipGewicht").val() == "alter") {
            $("#formGewicht").append('<label for="sliderAlter">Gewicht berechnen (Alter in Jahren):</label><input type="range" name="sliderAlter" id="sliderAlter" data-highlight="true" min="1" max="10" value="6">');
        } else {
            $("#formGewicht").append('<label for="sliderGewicht">Gewicht auswählen (kg KG):</label><input type="range" name="sliderGewicht" id="sliderGewicht" data-highlight="true" min="0" max="40" value="20">');
        }
        $("#gewicht").trigger("create");
    });

    $("#btnDosierungen").on("click", function() {
        var gewichtKg = $("#sliderGewicht").length ? parseInt($("#sliderGewicht").val(), 10) : parseInt(($("#sliderAlter").val(), 10) + 4) * 2;
        var medListe = [];
        $.each(phasen, function(phase, medPhase) {
            medListe.push("<li data-role=\"list-divider\">" + phase + "</li>");
            $.each(medPhase, function(med, medDosis) {
                if (med == "Flüssigkeitsbedarf") {
                    if (gewichtKg <= 10) {
                        var nDosis = rmZeros(4 * gewichtKg);
                    } else if (gewichtKg > 10 && gewichtKg <= 20) {
                        var nDosis = rmZeros(40 + ((gewichtKg - 10) * 2));
                    } else {
                        var nDosis = rmZeros(60 + gewichtKg - 20);
                    }
                    medListe.push("<li><h2>" + med + "</h2><p>" + nDosis + " " + medDosis.minDosis[1] + "</p></li>");
                } else { 
                    medListe.push("<li><h2>" + med + " (" + medDosis.c[0] + " " + medDosis.c[1] + ")</h2>");
                    if (med == "Salbutamol p.i.") {
                        // Dosierung pro Lebensjahr
                        var nDosis = rmZeros(medDosis.minDosis[0] * (gewichtKg / 2 - 4));
                    } else {
                        var nDosis = rmZeros(medDosis.minDosis[0] * gewichtKg);
                    }
                    nDosis > medDosis.stoppDosis && (nDosis = medDosis.stoppDosis);
                    var minVol = rmZeros(nDosis / medDosis.c[0]);
                    if (medDosis.maxDosis !== undefined) {
                        var hDosis = rmZeros(medDosis.maxDosis[0] * gewichtKg);
                        var maxVol = rmZeros(hDosis / medDosis.c[0]);
                    } 
                    hDosis !== undefined ? medListe.push("<p>" + nDosis + " - " + hDosis) : medListe.push("<p>" + nDosis);
                    medListe.push(" " + medDosis.minDosis[1]);
                    maxVol !== undefined ? medListe.push(" ≃ " + minVol + " - " + maxVol) :  medListe.push(" ≃ " + minVol);
                    medListe.push(" " + medDosis.c[1].split('/')[1]); 
                    medDosis.minDosis[1].indexOf("g/h") > -1 ?  medListe.push("/h</p></li>") : medListe.push("</p></li>");
                }
            });
        });
        $("#lvDosierungen").empty();
        $("#lvDosierungen").append(medListe.join(""));
        $("#lvDosierungen").listview("refresh");
    });
});
