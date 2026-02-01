import { RelationType } from "../enum/RelationType";

export type RelationProps = {
  id1: string;
  name1:string
  id2: string;
  name2:string
  type: RelationType;
};
export class Relation {
  private constructor(private props: RelationProps) {}

  static create(props: RelationProps) {
    return new Relation(props);
  }
  get id1() {
    return this.props.id1;
  }
  get id2() {
    return this.props.id2;
  }
  get type() {
    return this.props.type;
  }
  get name1() {
    return this.props.name1;
  }
  get name2() {
    return this.props.name2;
  }
}
