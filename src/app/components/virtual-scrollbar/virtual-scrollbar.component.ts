import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-virtual-scrollbar',
  templateUrl: './virtual-scrollbar.component.html',
  styleUrls: ['./virtual-scrollbar.component.scss'],
})
export class VirtualScrollbarComponent implements OnInit {
  @ViewChild('track', { read: ElementRef }) track: ElementRef;
  @Input() id = '';
  constructor() {}
  positionScroll = 0;
  movingTrack = false;
  startY = 0;

  ngAfterViewInit() {
    window.addEventListener('mousemove', (e) => {
      if (this.movingTrack) {
        this.clearSelection();
        if (this.outWrapper(e)) {
          this.track.nativeElement.style.top = e.clientY - this.startY + 'px';
          this.track.nativeElement.style.bottom = 'unset';
        }
      }
    });
    window.addEventListener('mouseup', (e) => {
      if (this.movingTrack) {
        this.movingTrack = false;
      }
    });
  }

  ngOnInit() {}

  mousedownMain(e) {
    console.log(e);
  }

  mousedownTrack(e) {
    this.movingTrack = true;
    this.startY =
      e.clientY - parseInt(getComputedStyle(this.track.nativeElement).top);
  }

  /**
   * Xóa vùng đang chọn
   * createdby ntdung5 13.06.2022
   */
  clearSelection() {
    if (window.getSelection()) {
      if (window.getSelection().empty) {
        window.getSelection().empty();
      } else if (window.getSelection().removeAllRanges) {
        window.getSelection().removeAllRanges();
      }
    }
    // else if (document.selection) {
    //   document.selection.empty();
    // }
  }
  outWrapper(e) {
    return false;
  }
}
