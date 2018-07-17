import { Component, Prop } from '@stencil/core';

@Component({
  tag: 'phodit-header',
  styleUrl: 'phodit-header.css',
  shadow: true
})
export class PhoditHeader {
  @Prop() action: string;

  render() {
    return (
      <div>
        Hello, World! I'm {this.action}
      </div>
    );
  }
}
