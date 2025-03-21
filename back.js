//Lógica de conversión

//Para que los elementos estén disponibles para interactuar entre ellos
document.addEventListener("DOMContentLoaded", () => {
    //Componentes que se utilizan
    const systemButtons = document.querySelectorAll(".system-btn"); //Origen
    const targetButtons = document.querySelectorAll(".target-btn"); //Destino
    const selectedSystemInput = document.getElementById("selectedSystem"); //Campo oculto, que elige el usuario: conversión origen
    const selectedTargetInput = document.getElementById("selectedTarget"); //Campo oculto, que elige el usuario: conversión destino
    const form = document.getElementById("conversionForm"); //Formulario que recibe los datos
    const resultElement = document.getElementById("result"); //Muestra el resultado
    const procedureElement = document.getElementById("procedure"); //Muestra el procedimiento

    //Para marcar los botones seleccionados por el usuario, como "activo"
    function selectButton(buttons, selectedValue, inputField) {
        buttons.forEach(btn => {
            if (btn.dataset.system === selectedValue || btn.dataset.target === selectedValue) {
                btn.classList.add("active");
            } else {
                btn.classList.remove("active");
            }
        });
        inputField.value = selectedValue;
    }

    // Eventos en los botones de sistema de origen y destino, para cada vez que se haga click en estos
    //Y así actualizar los campos ocultos 
    systemButtons.forEach(button => {
        button.addEventListener("click", () => {
            selectButton(systemButtons, button.dataset.system, selectedSystemInput);
        });
    });

    targetButtons.forEach(button => {
        button.addEventListener("click", () => {
            selectButton(targetButtons, button.dataset.target, selectedTargetInput);
        });
    });

    //Validaciones y qué va a hacer el botón "convertir"
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const system = selectedSystemInput.value;
        const target = selectedTargetInput.value;
        const number = document.getElementById("numberInput").value.trim();
        
        // Limpiar cualquier clase previamente asignada
        resultElement.classList.remove("text-success", "text-danger");
        procedureElement.textContent = "";

        // Si el usuario no selecciona un sistema de origen y/o de destino, aparecerá una alerta
        if (!system || !target) {
            alert("Por favor, selecciona un sistema de origen y destino.");
            return;
        }
        //Si el usuario no agrega un número que esté dentro de los sistemas propuestos, aparecerá una alerta
        if (number === "") {
            alert("Por favor, ingresa un número válido.");
            return;
        }
        //Si pasa las dos condiciones mencionadas, se muestra el resultado y procedimiento propuesto
        let result, procedure;
        try {
            ({ result, procedure } = convertNumber(system, target, number));
            resultElement.textContent = `El resultado es: ${result}`;
            resultElement.classList.add("text-success");
            procedureElement.textContent = procedure;  // Muestra el procedimiento
        } catch (error) {
            resultElement.textContent = error.message;
            resultElement.classList.add("text-danger");
            procedureElement.textContent = "";
        }
    });

    //Hacer la conversión entre sistemas numéricos
    function convertNumber(system, target, value) {
        let decimalValue;
        let procedure = "";
        
        // Verificación para que el sistema octal no tome en cuenta letras
        if (system === "octal" && /[^0-7]/.test(value)) {
            throw new Error("Número inválido. El sistema octal solo puede contener los dígitos del 0 al 7.");
        }

        //Casos dependiendo de la conversión que se quiera
        //Cada caso cuenta con la base correspondiente
        switch (system) {
            case "decimal":
                decimalValue = parseInt(value, 10);
                break;
            case "binary":
                decimalValue = parseInt(value, 2);
                break;
            case "octal":
                decimalValue = parseInt(value, 8);
                break;
            case "hexadecimal":
                decimalValue = parseInt(value, 16);
                break;
            // Si no es válido debe de enviar un error
            default:
                throw new Error("Sistema no válido.");
        }

        if (isNaN(decimalValue)) {
            throw new Error("Número inválido.");
        }
        //Devolver el resultado más una leyenda con el procedimiento que se debe hacer para llegar al resultado
        switch (`${system}-${target}`) {
            case "decimal-binary":
                procedure = "Procedimiento: Se divide entre 2 y se toman los residuos.";
                return { result: decimalValue.toString(2), procedure };

            case "binary-decimal":
                procedure = "Procedimiento:\n1. Numerar los dígitos de derecha a izquierda.\n2. Asignar a cada dígito su valor correspondiente en base 2.\n3. Multiplicar cada dígito del número binario por su valor correspondiente.\n4. Sumar todos los resultados obtenidos.";
                return { result: decimalValue.toString(10), procedure };

            case "decimal-octal":
                procedure = "Procedimiento: Se divide entre 8 y se toman los residuos.";
                return { result: decimalValue.toString(8), procedure };

            case "octal-decimal":
                procedure = "Procedimiento:\n1. Asigna a cada dígito octal una posición, comenzando desde 0.\n2. Multiplica cada dígito octal por 8 elevado a su posición correspondiente.\n3. Suma todos los resultados.";
                return { result: decimalValue.toString(10), procedure };

            case "decimal-hexadecimal":
                procedure = "Procedimiento: Se divide entre 16 y se toman los residuos.";
                return { result: decimalValue.toString(16).toUpperCase(), procedure };

            case "hexadecimal-decimal":
                procedure = "Procedimiento:\n1. Asigna a cada dígito hexadecimal una posición, comenzando desde 0.\n2. Multiplica cada dígito hexadecimal por 16 elevado a su posición correspondiente.\n3. Suma todos los resultados.";
                return { result: decimalValue.toString(10), procedure };

            case "binary-octal":
                procedure = "Procedimiento:\n1. Divide el número binario en grupos de 3 bits, comenzando desde la derecha.\n2. Si el número binario no tiene un número de bits múltiplo de 3, añade ceros a la izquierda.\n3. Convierte cada grupo de 3 bits a su equivalente octal.";
                return { result: decimalValue.toString(8), procedure };

            case "binary-hexadecimal":
                procedure = "Procedimiento:\n1. Divide el número binario en grupos de 4 bits, comenzando desde la derecha.\n2. Si el número binario no tiene un número de bits múltiplo de 4, añade ceros a la izquierda.\n3. Convierte cada grupo de 4 bits a su equivalente hexadecimal.";
                return { result: decimalValue.toString(16).toUpperCase(), procedure };

            case "octal-binary":
                procedure = "Procedimiento:\n1. Cada dígito octal se convierte a su equivalente binario de 3 bits.\n2. Une los grupos de 3 bits binarios en el mismo orden.";
                return { result: decimalValue.toString(2), procedure };

            case "octal-hexadecimal":
                procedure = "Procedimiento:\n1. Convierte cada dígito octal a su equivalente binario de 3 bits.\n2. Une los grupos de 3 bits binarios en el mismo orden.\n3. Agrupa los bits binarios en grupos de 4, comenzando desde la derecha.\n4. Convierte cada grupo de 4 bits a su equivalente hexadecimal.";
                return { result: decimalValue.toString(16).toUpperCase(), procedure };

            case "hexadecimal-binary":
                procedure = "Procedimiento:\n1. Cada dígito hexadecimal se convierte a su equivalente binario de 4 bits.\n2. Une los grupos de 4 bits binarios obtenidos en el mismo orden.";
                return { result: decimalValue.toString(2), procedure };

            case "hexadecimal-octal":
                procedure = "Procedimiento:\n1. Cada dígito hexadecimal se convierte a su equivalente binario de 4 bits.\n2. Se unen todos los grupos de 4 bits en el mismo orden.\n3. Se agrupan los bits binarios en grupos de 3, comenzando desde la derecha.\n4. Cada grupo de 3 bits se convierte a su equivalente octal.";
                return { result: decimalValue.toString(8), procedure };
            // Si la conversión no es posible, dará un error (alerta)    
            default:
                throw new Error("Conversión no válida.");
        }
    }
});
