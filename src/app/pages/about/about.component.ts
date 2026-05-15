import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { ContentService } from '../../services/content.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [AsyncPipe, NgFor, NgIf, HeaderComponent, FooterComponent],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {
  private contentService = inject(ContentService);
  content$ = this.contentService.content$;
}
