import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-virtual-scrollbar',
  templateUrl: './virtual-scrollbar.component.html',
  styleUrls: ['./virtual-scrollbar.component.scss'],
})
export class VirtualScrollbarComponent implements OnInit {
  @ViewChild('wrapper', { read: ElementRef }) wrapper: ElementRef;
  @ViewChild('track', { read: ElementRef }) track: ElementRef;
  @Input() id = '';
  constructor() {}
  positionScroll = 0;
  movingTrack = false;
  startY = 0;
  trackTop = 0;
  clientHeight = 0;
  scrollHeight = 0;

  thumbHeight = 0;
  trackHeight = 0;
  elementScrollable: any;

  ngAfterViewInit() {
    this.setSizeScrollbar();
    this.elementScrollable = document.getElementById(this.id);
    this.elementScrollable.addEventListener('scroll', (e) => {
      let scrollTop = this.elementScrollable.scrollTop;
      console.log(scrollTop);
      this.trackTop = (scrollTop / this.scrollHeight) * this.thumbHeight;
    });

    window.addEventListener('mousemove', (e) => {
      if (this.movingTrack) {
        this.clearSelection();
        var outWrapper = this.outWrapper(e);
        if (!outWrapper.out) {
          this.trackTop = e.clientY - this.startY;
        } else {
          if (e.clientY < this.thumbHeight - this.trackHeight) {
            this.trackTop = 0;
          } else {
            this.trackTop = this.thumbHeight - this.trackHeight;
          }
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

  /**
   * Đặt kicks thước cho scrollbar
   * createdby ntdung5 25.07.2022
   */
  setSizeScrollbar() {
    var scrollable = document.getElementById(this.id);
    this.clientHeight = scrollable.clientHeight;
    this.scrollHeight = scrollable.scrollHeight;
    this.thumbHeight =
      this.wrapper.nativeElement.getBoundingClientRect().height;
    this.trackHeight =
      (this.clientHeight / this.scrollHeight) * this.thumbHeight;
  }

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
    if (
      e.clientY - this.startY >= 0 &&
      e.clientY - this.startY <= this.thumbHeight - this.trackHeight
    ) {
      return {
        out: false,
      };
    }
    return {
      out: true,
    };
  }
}
