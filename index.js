const { select, input, checkbox } = require('@inquirer/prompts')
const fs = require("fs").promises

let messageGlobal = "Bem vindo ao App de Metas"

let goals 

const toLoadGoals = async () => {
    try { 
        const data = await fs.readFile("goals.json", "utf-8")
        goals = JSON.parse(data)
    }
    catch (err) {
        goals = []
    }
}

const saveGoals = async () => {
    await fs.writeFile("goals.json", JSON.stringify(goals, null, 2))
}

const registerGoals = async () => {
    const goal = await input({ message: "Digite a meta:" })

    if (goal.length == 0) {
        console.log("A meta não pode ser vazia.")
        return
    }

    goals.push(
        { value: goal, checked: false}
    )

    messageGlobal = "Meta Cadastrada Com Sucesso!"
}

const listGoals = async () => {
    const answers = await checkbox({
        message: "Use as setas para mudar de meta, o espaço para marcar e desmarcar e o Enter para finalizar essa etapa",
        choices: [...goals], 
        instructions: false
        // "Jogando todos os dados das metas em um novo array"
    })

    goals.forEach((g) => {
        g.checked = false
    })

    if (answers.length == 0) {
        messageGlobal = "Nenhuma meta selecionada!"
        return
    }

    answers.forEach((answer) => {
        const goal = goals.find((g) => {
            return g.value == answer
        })

        goal.checked = true;
    })

    messageGlobal = "Meta(s) marcadas como concluída(s)"
}

const goalsAchieved = async () => {
    const carriedout = goals.filter((goal) => {
        return goal.checked
    })

    if (carriedout.length == 0) {
        messageGlobal = "Não existem metas realizadas! :("
        return
    }

    await select({
        message: "Metas Realizadas",
        choices: [...carriedout]
    })
    
}

const noGoalsArchieved = async () => {
    const openGoals = goals.filter((goal) => {
        return !goal.checked
    })

    if (openGoals.length == 0) {
        messageGlobal = "Não possui nenhuma meta aberta!"
        return
    }

    await select({
        message: "Metas Abertas",
        choices: [...openGoals]
    })
}

const removeGoal = async () => {
    const goalUnchecked = goals.map((goal) => { // vai modificar o array original
        return {value: goal.value, checked: false}
    })
    const itemsDelete = await checkbox({
        message: "Selecione o item para remover",
        choices: [...goalUnchecked], 
        instructions: false
        // "Jogando todos os dados das metas em um novo array"
    })

    if (itemsDelete.length == 0) {
        messageGlobal = "Não tem itens para remover!"
        return
    }

    itemsDelete.forEach((item) => {
        goals = goals.filter((goal) => {
            return goal.value != item
        })
    })

    messageGlobal = "Meta(s) deletada(s) com sucesso!"
}

const viewMessage = () => {
    console.clear()

    if (messageGlobal != "") {
        console.log(messageGlobal)
        console.log("")
        messageGlobal = ""
    }
}

const start = async () => {
//Para usar o await precisa ter async 'Funções Assíncronas'
    await toLoadGoals()
    while (true) {
        viewMessage()
        await saveGoals()
        const option = await select({
            message: "Menu >",
            choices: [
                {
                    name: "Cadastrar Meta",
                    value: "register"
                },
                {
                    name: "Listar Metas",
                    value: "list"
                },
                {
                    name: "Metas Realizadas",
                    value: "carriedout"
                },
                {
                    name: "Metas Não Realizadas",
                    value: "notcarriedout"
                },
                {
                    name: "Remover Uma Meta",
                    value: "removegoal"
                },
                {
                    name: "Sair",
                    value: "quit"
                }
            ]
        })
        //Palavra 'await' é aguardar/esperar

        switch (option) {
            case "register":
                //Cadastrar Meta
                await registerGoals()
                // Vai esperar toda a função cadastrar meta acontecer
                break
            case "list":
                //Listar metas
                await listGoals()
                break
            case "carriedout":
                //Metas realizadas
                await goalsAchieved()
                break
            case "notcarriedout":
                //Metas não realizadas
                await noGoalsArchieved()
                break
            case "removegoal":
                //Remover Metas
                await removeGoal()
                break
            case "quit":
                //Sair do App
                console.log("Saindo...")
                return 
        }
    
    }
}

start()
