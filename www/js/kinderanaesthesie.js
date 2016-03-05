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
    "Praemedikation": { 
        "Ibuprofen": [10, "X", "mg"],
        "Midazolam": [0.4, "X", "mg"],
        "Midazolam nasal": [0.2, "X", "mg"],
        },
    "Einleitung": {
        "Propofol": [2, 4, "mg"],
        "Remifentanil": [0.5, "X", "µg/min"],
        "Rocuronium": [0.6, "X", "mg"],
        "Succinylcholin": [1.5, 2, "mg"],
        "Sufentanil": [0.5, 1, "µg"],
        },
    "Aufrechterhaltung": {
        "Flüssigkeitsbedarf": ["X", "X", "ml/h"],
        "Propofol-P": [5, 10, "mg/h"],
        "Remifentanil-P": [0.2, 0.3, "µg/min"],
        },
    "Antagonisierung": {
        "Flumazenil":[0.01, "X", "mg"],
        "Naloxon": [0.01, "X", "mg"],
        "Neostigmin" : [0.05, "X", "mg"],
        },
    "Schmerztherapie": {
        "Metamizol": [10, 20, "mg"],
        "Paracetamol supp.": [40, "X", "mg"],
        "Paracetamol i.v.": [15, "X", "mg"],
        "Piritramid": [0.05, 0.1, "mg"],
        },
    "PONV" : {
        "Dexamethason": [0.15, "X", "mg"],
        "Ondansetron": [0.1, "X", "mg"],
        },
    "Aufwachraum-Delir": {
        "Clonidin": [0.5, 1, "µg"],
        "Ketamin S": [0.5, 1, "mg"],
        "Propofol": [0.5, 1, "mg"],
        },
    "Notfall": {
        "Adrenalin": [0.01, "X", "mg"],
        "Akrinor": [0.01, "X", "ml"],
        "Amiodaron": [5, "X", "mg"],
        "Atropin": [0.01, "X", "mg"],
        "Noradrenalin": [0.1, "X", "µg"],
        "Prednisolon": [10, "X", "mg"],
        "Salbutamol": [0.1, "X", "mg"],
        },
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
        var gewichtKg = $("#sliderGewicht").length ? parseInt($("#sliderGewicht").val(), 10) : ((parseInt($("#sliderAlter").val(), 10) + 4) * 2);
        var medItems = [];
        $.each(phasen, function(phase, medPhase) {
            medItems.push("<tr><td><i>" + phase + "</i></td><td></td><td></td></tr>");
            $.each(medPhase, function(med, medDosis) {
                switch (med) {
                    case "Midazolam":
                        var minDosis = ((medDosis[0] * gewichtKg) > 7.5) ? 7.5 : (medDosis[0] * gewichtKg);
                        break;
                    case "Flüssigkeitsbedarf":
                        if (gewichtKg <= 10) {
                            var minDosis = (4 * gewichtKg);
                        } else if (gewichtKg > 10 && gewichtKg <= 20) {
                            var minDosis = (40 + ((gewichtKg - 10) * 2));
                        } else {
                            var minDosis = (60 + gewichtKg - 20);
                        }
                        break;
                    default:
                        var minDosis = (medDosis[0] * gewichtKg);
                        break;
                }
                var maxDosis = (medDosis[1] != "X") ? " - " + (medDosis[1] * gewichtKg).toFixed(1) : "";
                medItems.push("<tr><td id=\"wStoff\">" + med + "</td><td id=\"wDosis\">" + minDosis.toFixed(1) + maxDosis + "</td><td id=\"wEinheit\">" + medDosis[2] + "</td></tr>");
            });
        });
        $("#tbdDosierungen").empty();
        $("#tbdDosierungen").append(medItems.join(""));
        $("#tblDosierungen").table("refresh");
    });
});
