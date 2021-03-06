import { useHistory, useParams } from 'react-router-dom'
import logoImg from '../assets/images/logo.svg'
import { Button } from '../componets/button'
import { Question } from '../componets/Question'
import { RoomCode } from '../componets/RoomCode'
import '../styles/room.scss'
import '../styles/question.scss'
import { useRoom } from '../hooks/useRoom'
import deliteImg from '../assets/images/delete.svg'
import { database } from '../services/firebase'
import checkImg from '../assets/images/check.svg'
import answerImg from '../assets/images/answer.svg'


type RoomParams = {
    id: string
}

export function AdminRoom() {
   // const { user } = useAuth()
   const history = useHistory()
    const params = useParams<RoomParams>();
    const roomId = params.id
    const { title, questions } = useRoom(roomId)

    async function handleEndRoom() {
       await database.ref(`rooms/${roomId}`).update({
           endAt: new Date()
       })
       history.push('/')
    }


    async function handleDeleteQuestion(questionId: string) {
        if(window.confirm('Tem certeza que deseja excluir essa pergunta?')) {
            await database.ref(`rooms/${roomId}/questions/${questionId}`).remove()
        }
    }

    async function handleCheckQuestionAsAnswered(questionId: string) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isAnswered: true
        })
    }

    async function handleHighLightQuestion(questionId: string) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isHighlighted: true
        })
    }

    return (
        <div id="page-room">
            <header>
                <div className="content">
                    <img src={logoImg} alt="Letmeask" />
                    <div>
                        <RoomCode code={roomId} />
                        <Button isOutlined onClick={handleEndRoom}>Encerrar sala</Button>
                    </div>
                </div>
            </header>
            <main className="content">
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    { questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
                </div>
                <div className="question-list">
                    {questions.map(question => {
                        return (
                            <Question
                                key={question.id}
                                content={question.content}
                                author={question.author}
                                isAnswered={question.isAnswered}
                                isHighLighted={question.isHighlighted}
                            >
                                {
                                    !question.isAnswered && (
                                    <>
                                        <button
                                            type='button'
                                            onClick={() => handleCheckQuestionAsAnswered(question.id)}
                                        >
                                            <img src={checkImg} alt="Marcar pergunta respondida" />
                                        </button>

                                        <button
                                            type='button'
                                            onClick={() => handleHighLightQuestion(question.id)}
                                        >
                                            <img src={answerImg} alt="Dar destaque ?? pergunta" />
                                        </button>

                                    </>
                                    )
                                }

                                <button
                                    type='button'
                                    onClick={() => handleDeleteQuestion(question.id)}
                                >
                                    <img src={deliteImg} alt="Remover pergunta" />
                                </button>
                            </Question>
                        )
                    })}
                </div>
            </main>
        </div>
    )
}