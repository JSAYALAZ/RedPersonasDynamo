export type PersonaProps={
    id: number,
    email: string,
    name: string,
    nickname: string,
    residence: string,
}
export class Persona{
    private constructor(private props: PersonaProps){}

    static create(props: PersonaProps){
        return new Persona(props);
    }
    get id(){
        return this.props.id;
    }
    get email(){
        return this.props.email;
    }
    get name(){
        return this.props.name;
    }
    get nickname(){
        return this.props.nickname;
    }
    get residence(){
        return this.props.residence;
    }

}